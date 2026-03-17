(function() {
    var comp = app.project.activeItem;
    if (comp) {
        var layer = comp.selectedLayers[0];
        try {
            layer.stretch = 66.66;
            alert("Changed to " + layer.stretch);
        } catch(e) {
            alert("Error: " + e.toString());
        }
    }
})();
