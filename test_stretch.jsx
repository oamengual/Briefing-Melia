(function() {
    var comp = app.project.activeItem;
    if (comp && comp instanceof CompItem && comp.selectedLayers.length > 0) {
        var layer = comp.selectedLayers[0];
        alert("Stretch is: " + layer.stretch);
    } else {
        alert("Please select a layer.");
    }
})();
