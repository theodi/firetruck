$(function(){
    let $continue = $('#click_continue');
    $continue.on('click', function(){
        $('#body').show();
        $('#small').hide();
    });

    bind_modal_open();
    bind_modal_close();

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

    $('body').click(function (event)
    {
        if(!$(event.target).closest('.modal').length &&
            !(
                $(event.target).is('#about') ||
                $(event.target).is('#copy_that') ||
                $(event.target).is('#credits') ||
                $(event.target).is('#gee')

            ) &&
            !($(event.target).is('a'))
        )
        {
            $('.modal').hide();
        }
    });

});

let modal_bitmation_time = 250;
/**
 * bind_modal_open
 */
var modal_opening_id = "";
function bind_modal_open(){
    $('[data-modal]').on('click', function(e){
        e.preventDefault();
        var elem = $(this),
            modal = elem.data('modal'),
//            navigation = $('#main-navigation'),
            modals = $('.modal');
//        slide_main_menu(navigation.find('.main-menu'), navigation.find('.overlay'), 'close');
        modals.hide();
        $('#hamenu').hide();
        modal_opening_id = elem.attr('id');
        open_modal(modal);
    });
}
/**
 * bind_modal_close
 */
function bind_modal_close(){
    $('.close-modal, .modal .overlay').on('click', function(e){
        e.preventDefault();
        var elem = $(this),
            parent = elem.closest('.modal'),
            modal = parent.attr('id');
        close_modal(modal);
    });
}
/**
 * open_modal
 * @param id
 */
function open_modal(id){
    var modal = $('#'+ id);
//    modal.find('.overlay').show();
    modal.stop().fadeIn(modal_bitmation_time);
}
/**
 * close_modal
 * @param id
 */
function close_modal(id){
    var modal = $('#'+ id);
    modal.stop().fadeOut(modal_bitmation_time, function(){
//        modal.find('.overlay').hide();
    });
}
