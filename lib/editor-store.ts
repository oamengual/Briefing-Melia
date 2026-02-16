import { create } from 'zustand';
import { EditorState, EditorLayer } from '@/lib/types';

interface EditorStore extends Omit<EditorState, 'selectedLayerId'> {
    selectedLayerIds: string[];
    setCanvas: (state: Partial<EditorState>) => void;
    setScale: (scale: number) => void;
    addLayer: (layer: EditorLayer) => void;
    updateLayer: (id: string, updates: Partial<EditorLayer>) => void;
    updateSelectedLayers: (updates: Partial<EditorLayer>) => void;
    selectLayer: (id: string, multi?: boolean, range?: boolean) => void;
    deselectAll: () => void;
    removeLayer: (id: string) => void;
    moveLayer: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
    setFeedData: (data: EditorState['feedData']) => void;
    setCurrentRow: (index: number) => void;
    alignSelectedLayers: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
    distributeSelectedLayers: (type: 'horizontal' | 'vertical') => void;
    moveSelectedLayers: (dx: number, dy: number) => void;
    scaleSelectedLayers: (scaleX: number, scaleY: number, origin: { x: number, y: number }) => void;
    rotateSelectedLayers: (angle: number) => void; // Delta angle
    setActiveTool: (tool: EditorState['activeTool']) => void;
    setPan: (pan: { x: number, y: number }) => void;
    reset: () => void;
    startTransform: () => void;
    applyTransform: (type: 'move' | 'scale' | 'rotate', delta: any, origin?: { x: number, y: number }) => void;
    endTransform: () => void;

    // History
    history: EditorState[];
    future: EditorState[];
    pushHistory: () => void;
    undo: () => void;
    redo: () => void;

    // Helper to get selected objects
    getSelectedLayers: () => EditorLayer[];
    getState: () => EditorState;
}

// Recursive update
const updateLayerRecursive = (layers: EditorLayer[], id: string, updates: Partial<EditorLayer>): EditorLayer[] => {
    return layers.map(layer => {
        if (layer.id === id) {
            return { ...layer, ...updates };
        }
        if (layer.children) {
            return { ...layer, children: updateLayerRecursive(layer.children, id, updates) };
        }
        return layer;
    });
};

// Recursive retrieval
const findLayerRecursive = (layers: EditorLayer[], id: string): EditorLayer | undefined => {
    for (const layer of layers) {
        if (layer.id === id) return layer;
        if (layer.children) {
            const found = findLayerRecursive(layer.children, id);
            if (found) return found;
        }
    }
};

// Helper: Remove node from tree
const removeNode = (nodes: EditorLayer[], id: string): { nodes: EditorLayer[], removed?: EditorLayer } => {
    let removed: EditorLayer | undefined;

    // Check top level
    const index = nodes.findIndex(n => n.id === id);
    if (index !== -1) {
        removed = nodes[index];
        const newNodes = [...nodes];
        newNodes.splice(index, 1);
        return { nodes: newNodes, removed };
    }

    // Recurse
    const newNodes = nodes.map(node => {
        if (node.children) {
            const result = removeNode(node.children, id);
            if (result.removed) {
                removed = result.removed;
                return { ...node, children: result.nodes };
            }
        }
        return node;
    });

    return { nodes: newNodes, removed };
};

// Helper: Insert node into tree
const insertNode = (nodes: EditorLayer[], targetId: string, position: 'before' | 'after' | 'inside', nodeToInsert: EditorLayer): EditorLayer[] => {
    // If targetId is ROOT (special case?), handle outside? Assuming valid targetId for now.

    // Check top level for 'before/after'
    const index = nodes.findIndex(n => n.id === targetId);
    if (index !== -1) {
        if (position === 'inside') {
            // Treat target as group
            const target = nodes[index];
            const newChildren = target.children ? [nodeToInsert, ...target.children] : [nodeToInsert];
            // Default insert at top (front) for 'inside'? Or bottom?
            // Usually top logic.
            // Visual order: Top of list = Front. 
            // Canvas render: End of list = Front.
            // If we reverse for display, "Top of List" means "End of Array".
            // We'll insert at END of array (Front) for 'inside' unless specific.
            // Let's stick to: Children array order = Z-order (0=Back).
            // Layer Panel displays Reversed (Top=Front).
            // So inserting "Inside" usually puts it at top of group visually -> End of Array.
            const children = target.children ? [...target.children, nodeToInsert] : [nodeToInsert];

            const newNodes = [...nodes];
            newNodes[index] = { ...target, children };
            return newNodes;
        }

        // Before/After
        const newNodes = [...nodes];
        // Visual 'before' (above in list) means HIGH Z-index (Later in array).
        // Visual 'after' (below in list) means LOW Z-index (Earlier in array).
        // BUT my LayerPanel iterates REVERSED.
        // So:
        // List: [A (idx 2), B (idx 1), C (idx 0)]
        // Drag C 'before' A (visually above A).
        // Should become [C, A, B]? No. 
        // Visual: [C, A, B]. Array: [B, A, C].
        // "Before" in UI (Top) -> "After" in Array (High Index).
        // This is confusing. 
        // Let's assume 'position' refers to ARRAY order context logic passed from UI?
        // UI should calculate simple insertion index.
        // Or if 'position' is semantic ('above' visual).

        // Let's define: 'after' = Array Index + 1. 'before' = Array Index.
        // UI handles mapping visual -> array logic.

        if (position === 'after') {
            newNodes.splice(index + 1, 0, nodeToInsert);
        } else {
            newNodes.splice(index, 0, nodeToInsert);
        }
        return newNodes;
    }

    return nodes.map(node => {
        if (node.children) {
            return { ...node, children: insertNode(node.children, targetId, position, nodeToInsert) };
        }
        return node;
    });
};


const initialState: any = {
    width: 1080,
    height: 1080,
    layers: [],
    scale: 0.5,
    pan: { x: 0, y: 0 },
    selectedLayerIds: [],
    currentFeedRow: 0,
    activeTool: 'move',
};

export const useEditorStore = create<EditorStore>((set, get) => ({
    ...initialState,

    setActiveTool: (tool) => set({ activeTool: tool }),
    setPan: (pan) => set({ pan }),

    setFeedData: (data) => set({ feedData: data, currentFeedRow: 0 }),
    setCurrentRow: (index) => set({ currentFeedRow: index }),

    setCanvas: (state) => set((s) => ({ ...s, ...state })),
    setScale: (scale: number) => set({ scale }),

    addLayer: (layer) => set((s) => ({ layers: [...s.layers, layer] })),

    updateLayer: (id, updates) => set((s) => ({
        layers: updateLayerRecursive(s.layers, id, updates)
    })),

    updateSelectedLayers: (updates) => set((s) => {
        let newLayers = s.layers;
        s.selectedLayerIds.forEach(id => {
            newLayers = updateLayerRecursive(newLayers, id, updates);
        });
        return { layers: newLayers };
    }),

    selectLayer: (id, multi = false, range = false) => set((s) => {
        if (multi) {
            const exists = s.selectedLayerIds.includes(id);
            if (exists) return { selectedLayerIds: s.selectedLayerIds.filter(i => i !== id) };
            return { selectedLayerIds: [...s.selectedLayerIds, id] };
        }
        return { selectedLayerIds: [id] };
    }),

    deselectAll: () => set({ selectedLayerIds: [] }),

    removeLayer: (id) => set((s) => {
        const { nodes } = removeNode(s.layers, id);
        return { layers: nodes, selectedLayerIds: s.selectedLayerIds.filter(lid => lid !== id) };
    }),

    moveLayer: (draggedId, targetId, position) => set((s) => {
        // 1. Remove
        const { nodes: layersWithoutDragged, removed } = removeNode(s.layers, draggedId);
        if (!removed) return s;

        // 2. Insert
        // If targetId is 'root', push to end (Top)?
        if (targetId === 'root') {
            return { layers: [...layersWithoutDragged, removed] };
        }

        const newLayers = insertNode(layersWithoutDragged, targetId, position, removed);
        return { layers: newLayers };
    }),

    alignSelectedLayers: (type) => set((s) => {
        const { layers, width, height, selectedLayerIds } = s;
        if (selectedLayerIds.length === 0) return s;

        let newLayers = layers;

        selectedLayerIds.forEach(id => {
            const layer = findLayerRecursive(layers, id);
            if (layer) {
                let newLeft = layer.left;
                let newTop = layer.top;

                switch (type) {
                    case 'left': newLeft = 0; break;
                    case 'center': newLeft = (width - layer.width) / 2; break;
                    case 'right': newLeft = width - layer.width; break;
                    case 'top': newTop = 0; break;
                    case 'middle': newTop = (height - layer.height) / 2; break;
                    case 'bottom': newTop = height - layer.height; break;
                }
                newLayers = updateLayerRecursive(newLayers, id, { left: newLeft, top: newTop });
            }
        });

        return { layers: newLayers };
    }),

    distributeSelectedLayers: (type) => set((s) => {
        const { layers, selectedLayerIds } = s;
        if (selectedLayerIds.length < 3) return s;

        const selected = selectedLayerIds
            .map(id => findLayerRecursive(layers, id))
            .filter((l): l is EditorLayer => !!l);

        if (selected.length < 3) return s;

        let newLayers = layers;

        if (type === 'horizontal') {
            // Sort by center X
            selected.sort((a, b) => (a.left + a.width / 2) - (b.left + b.width / 2));
            const min = selected[0].left + selected[0].width / 2;
            const max = selected[selected.length - 1].left + selected[selected.length - 1].width / 2;
            const totalSpan = max - min;
            const perStep = totalSpan / (selected.length - 1);

            selected.forEach((layer, i) => {
                if (i === 0 || i === selected.length - 1) return;
                const newCenter = min + (perStep * i);
                const newLeft = newCenter - layer.width / 2;
                newLayers = updateLayerRecursive(newLayers, layer.id, { left: newLeft });
            });
        } else {
            // Sort by center Y
            selected.sort((a, b) => (a.top + a.height / 2) - (b.top + b.height / 2));
            const min = selected[0].top + selected[0].height / 2;
            const max = selected[selected.length - 1].top + selected[selected.length - 1].height / 2;
            const totalSpan = max - min;
            const perStep = totalSpan / (selected.length - 1);

            selected.forEach((layer, i) => {
                if (i === 0 || i === selected.length - 1) return;
                const newCenter = min + (perStep * i);
                const newTop = newCenter - layer.height / 2;
                newLayers = updateLayerRecursive(newLayers, layer.id, { top: newTop });
            });
        }

        return { layers: newLayers };
    }),

    moveSelectedLayers: (dx, dy) => set((s) => {
        let newLayers = s.layers;
        s.selectedLayerIds.forEach(id => {
            const layer = findLayerRecursive(s.layers, id);
            if (layer) {
                newLayers = updateLayerRecursive(newLayers, id, {
                    left: layer.left + dx,
                    top: layer.top + dy
                });
            }
        });
        return { layers: newLayers };
    }),

    scaleSelectedLayers: (scaleX, scaleY, origin) => set((s) => {
        let newLayers = s.layers;
        s.selectedLayerIds.forEach(id => {
            const layer = findLayerRecursive(s.layers, id);
            if (layer) {
                const dx = layer.left - origin.x;
                const dy = layer.top - origin.y;
                const newLeft = origin.x + dx * scaleX;
                const newTop = origin.y + dy * scaleY;
                const newWidth = layer.width * scaleX;
                const newHeight = layer.height * scaleY;

                const updates: any = { left: newLeft, top: newTop, width: newWidth, height: newHeight };
                if (layer.fontSize) updates.fontSize = layer.fontSize * Math.abs(scaleX);
                newLayers = updateLayerRecursive(newLayers, id, updates);
            }
        });
        return { layers: newLayers };
    }),

    rotateSelectedLayers: (angle) => set((s) => {
        let newLayers = s.layers;
        s.selectedLayerIds.forEach(id => {
            const layer = findLayerRecursive(s.layers, id);
            if (layer) {
                newLayers = updateLayerRecursive(newLayers, id, { rotation: (layer.rotation || 0) + angle });
            }
        });
        return { layers: newLayers };
    }),

    startTransform: () => set((s) => ({ layerSnapshot: s.layers })),

    endTransform: () => set({ layerSnapshot: undefined }),

    applyTransform: (type, delta, origin) => set((s) => {
        const baseLayers = s.layerSnapshot || s.layers;
        let newLayers = baseLayers;

        s.selectedLayerIds.forEach(id => {
            const layer = findLayerRecursive(baseLayers, id);
            if (!layer) return;

            let updates: Partial<EditorLayer> = {};

            if (type === 'move') {
                const { dx, dy } = delta;
                updates = { left: layer.left + dx, top: layer.top + dy };
            } else if (type === 'scale' && origin) {
                const { scaleX, scaleY } = delta;
                const dx = layer.left - origin.x;
                const dy = layer.top - origin.y;
                // Note: If using snapshot, we apply scale to ORIGINAL values.
                // This means 'scaleX' passed here must be TOTAL Scale Factor from Start.

                const newLeft = origin.x + dx * scaleX;
                const newTop = origin.y + dy * scaleY;
                const newWidth = layer.width * scaleX;
                const newHeight = layer.height * scaleY;

                updates = { left: newLeft, top: newTop, width: newWidth, height: newHeight };
                if (layer.type === 'image') {
                    // Images typically handled by width/height, but if we had special scaling props...
                    // For now, no extra props.
                }
            } else if (type === 'rotate') {
                const angle = delta as number; // Total angle delta?
                // If using snapshot, we add 'angle' to snapshot's rotation.
                // Assuming 'angle' here is "Total Rotation Change since start".
                updates = { rotation: (layer.rotation || 0) + angle };
            }

            if (Object.keys(updates).length > 0) {
                newLayers = updateLayerRecursive(newLayers, id, updates);
            }
        });

        return { layers: newLayers };
    }),

    pushHistory: () => set((s) => {
        const current: EditorState = {
            width: s.width, height: s.height, layers: s.layers,
            selectedLayerIds: s.selectedLayerIds, scale: s.scale, pan: s.pan,
            activeTool: s.activeTool, currentFeedRow: s.currentFeedRow, feedData: s.feedData
        };
        return {
            history: [...s.history, current].slice(-20),
            future: []
        };
    }),

    undo: () => set((s) => {
        if (s.history.length === 0) return {};
        const prev = s.history[s.history.length - 1];
        const newHist = s.history.slice(0, -1);
        const current: EditorState = {
            width: s.width, height: s.height, layers: s.layers,
            selectedLayerIds: s.selectedLayerIds, scale: s.scale, pan: s.pan,
            activeTool: s.activeTool, currentFeedRow: s.currentFeedRow, feedData: s.feedData
        };
        return {
            ...prev,
            history: newHist,
            future: [current, ...s.future].slice(0, 20)
        };
    }),

    redo: () => set((s) => {
        if (s.future.length === 0) return {};
        const next = s.future[0];
        const newFut = s.future.slice(1);
        const current: EditorState = {
            width: s.width, height: s.height, layers: s.layers,
            selectedLayerIds: s.selectedLayerIds, scale: s.scale, pan: s.pan,
            activeTool: s.activeTool, currentFeedRow: s.currentFeedRow, feedData: s.feedData
        };
        return {
            ...next,
            history: [...s.history, current].slice(-20),
            future: newFut
        };
    }),

    reset: () => set(initialState),

    getSelectedLayers: () => {
        const s = get();
        return s.selectedLayerIds.map(id => findLayerRecursive(s.layers, id)).filter(Boolean) as EditorLayer[];
    },

    getState: () => {
        const s = get();
        return {
            width: s.width,
            height: s.height,
            layers: s.layers,
            selectedLayerIds: s.selectedLayerIds,
            scale: s.scale,
            pan: s.pan,
            activeTool: s.activeTool,
            currentFeedRow: s.currentFeedRow,
            feedData: s.feedData
        };
    }
}));
