import { getActiveComp } from "./aeft-utils";



export const helloTest = () => {
    app.beginUndoGroup("AE");

    let comp = getActiveComp();
    let layers = comp.selectedLayers;
    if(!layers) {
        alert("请选择图层!");
        return
    };
    for (let i = 0; i < layers.length; i++) {
        layers[i].opacity.expression = "index*10+50";
    }

    app.endUndoGroup();

};

export const auto = () => {
    app.beginUndoGroup("AE");
    let comp = getActiveComp();
    var layer = comp.selectedLayers[0];
    if(!layer) {
        alert("请选择一个图层!");
        return
    };
    var control = comp.layers.addNull();
    control.name = '控制器';
    var slider = control.Effects.addProperty("ADBE Slider Control");
    slider.name = 'opacity';
    slider.property("ADBE Slider Control-0001").setValue(10);
    layer.opacity.expression = 
    "thisComp.layer('控制器').effect('opacity')(1);";
    app.endUndoGroup();

};

export const expressions = () => {
    app.beginUndoGroup("AE");
    let comp = getActiveComp();
    var layer = comp.selectedLayers[0];
    if(!layer) {
        alert("请选择一个图层!");
        return
    };
    layer.opacity.expression = "index*10+50";
    app.endUndoGroup();
    
};

export const transfer = (str:string) => {
    app.beginUndoGroup("AE");
    eval(str);
    // app.scheduleTask(str,0,false);
    app.endUndoGroup();
};