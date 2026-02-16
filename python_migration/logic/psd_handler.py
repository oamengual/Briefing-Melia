from psd_tools import PSDImage
from PIL import Image
import io
import uuid

class PsdHandler:
    def __init__(self, file_stream):
        """
        Initialize with a file-like object (e.g. from streamlit uploader)
        """
        self.psd = PSDImage.open(file_stream)
        self.layers = []
        self._parse_layers()

    def _parse_layers(self, parent=None):
        """
        Recursively parse layers
        """
        layers = parent if parent else self.psd
        
        for layer in layers:
            layer_data = {
                "id": str(uuid.uuid4()),
                "name": layer.name,
                "visible": layer.visible,
                "opacity": layer.opacity,
                "blend_mode": layer.blend_mode,
                "left": layer.left,
                "top": layer.top,
                "width": layer.width,
                "height": layer.height,
                "type": "group" if layer.is_group() else "layer",
                "kind": layer.kind,
                "text": layer.text if layer.kind == "type" else None,
            }
            
            # Text properties if available
            if layer.kind == "type":
                # psd-tools exposes engine_dict for detailed text properties, 
                # but simple text access is usually enough for identification
                pass

            self.layers.append(layer_data)
            
            if layer.is_group():
                self._parse_layers(layer)

    def get_preview(self) -> Image.Image:
        """
        Return the composite image
        """
        return self.psd.composite()

    def get_layer_structure(self):
        """
        Return rudimentary layer list
        """
        return self.layers

    @property
    def size(self):
        return self.psd.size

