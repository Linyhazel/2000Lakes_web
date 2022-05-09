function changeRadioClass() {
    var radios = document.getElementsByName("radio-btn");
    for( i = 0; i < radios.length; i++ ) {
        var selector = 'label[for=' + radios[i].id + ']';
        var label = document.querySelector(selector);
        //console.log(label);
        if(radios[i].checked) {
            label.setAttribute("class", "navigation-btn checkedR");
        }
        else{
            label.setAttribute("class", "navigation-btn");
        }
    }
}
changeRadioClass();