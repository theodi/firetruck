$(function(){
    let $continue = $('#click_continue');
    $continue.on('click', function(){
        $('#body').show();
        $('#small').hide();
    });

    $('.hamburger').on('click', function(){
       $(this).toggleClass("change");
       let hamenu = $('#hamenu');
       if (hamenu.is(":visible")) {
           hamenu.fadeOut(150);
       } else {
           hamenu.fadeIn(150);
       }
   });
   $('#theodi').on('click', function() {
      let href = $('#theodi a').attr('href');
      window.open(href);
   });
});