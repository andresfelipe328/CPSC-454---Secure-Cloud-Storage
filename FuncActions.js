var modalButtonU = document.querySelector('.uploadButton');
var modalU = document.querySelector('.upmodal');
var modalCloseU = document.querySelector('.closeUp');

modalButtonU.addEventListener('click', 
function() {
    modalU.classList.add('active');
});

modalCloseU.addEventListener('click', 
function() {
    modalU.classList.remove('active');
});


var modalButtonD = document.querySelector('.downloadButton');
var modalD = document.querySelector('.downmodal');
var modalCloseD = document.querySelector('.closeDown');

modalButtonD.addEventListener('click', 
function() {
    modalD.classList.add('active');
});

modalCloseD.addEventListener('click', 
function() {
    modalD.classList.remove('active');
});


var modalButtonDel = document.querySelector('.deleteButton');
var modalDel = document.querySelector('.delmodal');
var modalCloseDel = document.querySelector('.closeDel');

modalButtonDel.addEventListener('click', 
function() {
    modalDel.classList.add('active');
});

modalCloseDel.addEventListener('click', 
function() {
    modalDel.classList.remove('active');
});