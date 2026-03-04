import os
import json
import uuid
import time
import shutil
from typing import List, Optional, Dict, Any
from .briefing_store import BriefingStore

class BriefingManager:
    DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'briefs')
    PSD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'psds')

    @classmethod
    def ensure_dir(cls):
        os.makedirs(cls.DATA_DIR, exist_ok=True)
        os.makedirs(cls.PSD_DIR, exist_ok=True)

    @classmethod
    def list_briefs(cls) -> List[Dict[str, Any]]:
        cls.ensure_dir()
        briefs = []
        for filename in os.listdir(cls.DATA_DIR):
            if filename.endswith('.json'):
                try:
                    with open(os.path.join(cls.DATA_DIR, filename), 'r') as f:
                        data = json.load(f)
                        # Return metadata for listing
                        briefs.append({
                            'id': data.get('id'),
                            'name': data.get('details', {}).get('campaignName', 'Untitled'),
                            'brand': data.get('details', {}).get('brand', 'Unbranded'),
                            'status': data.get('status', 'draft'),
                            'updated_at': data.get('updated_at', 0),
                            'asset_count': cls._calculate_asset_count(data)
                        })
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
        
        # Sort by updated_at desc
        return sorted(briefs, key=lambda x: x['updated_at'], reverse=True)

    @classmethod
    def get_brief(cls, brief_id: str) -> Optional[BriefingStore]:
        filepath = os.path.join(cls.DATA_DIR, f"{brief_id}.json")
        if not os.path.exists(filepath):
            return None
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                return BriefingStore.from_dict(data)
        except Exception as e:
            print(f"Error loading brief {brief_id}: {e}")
            return None

    @classmethod
    def save_brief(cls, store: BriefingStore) -> str:
        cls.ensure_dir()
        if not store.id:
            store.id = str(uuid.uuid4())
        
        store.updated_at = time.time()
        filepath = os.path.join(cls.DATA_DIR, f"{store.id}.json")
        
        data = store.to_dict()
        # Add top-level status for easy filtering
        data['status'] = 'draft' # Default for now
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        return store.id

    @classmethod
    def delete_brief(cls, brief_id: str):
        filepath = os.path.join(cls.DATA_DIR, f"{brief_id}.json")
        if os.path.exists(filepath):
            os.remove(filepath)

    @classmethod
    def duplicate_brief(cls, brief_id: str) -> Optional[str]:
        store = cls.get_brief(brief_id)
        if not store:
            return None
        
        store.id = None # Force new ID
        store.details.campaignName = f"{store.details.campaignName} (Copy)"
        return cls.save_brief(store)

    @staticmethod
    def _calculate_asset_count(data: Dict[str, Any]) -> int:
        matrix = data.get('matrix', {})
        count = 0
        for pids in matrix.values():
            count += len(pids)
        return count

    @classmethod
    def get_stats(cls) -> Dict[str, Any]:
        briefs = cls.list_briefs()
        total_assets = sum(b['asset_count'] for b in briefs)
        active_count = len([b for b in briefs if b['status'] in ['review', 'approved']])
        
        return {
            'total': len(briefs),
            'active': active_count,
            'drafts': len([b for b in briefs if b['status'] == 'draft']),
            'completed': len([b for b in briefs if b['status'] == 'completed']),
            'total_assets': total_assets
        }

    @classmethod
    def save_psd_asset(cls, brief_id: str, file_content: bytes, filename: str) -> str:
        cls.ensure_dir()
        target_dir = os.path.join(cls.PSD_DIR, brief_id)
        os.makedirs(target_dir, exist_ok=True)
        
        filepath = os.path.join(target_dir, filename)
        with open(filepath, 'wb') as f:
            f.write(file_content)
        
        return filepath
