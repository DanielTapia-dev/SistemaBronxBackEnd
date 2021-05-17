/*
Template Name: Admin Template
Author: Wrappixel

File: js
*/
// ==============================================================
// Auto select left navbar
// ==============================================================
const sidebar2 = () => {
    //console.log('Esta entrando al SIDEBAR');
  $(function () {
      var url = window.location + "";
         var path = url.replace(window.location.protocol + "//" + window.location.host + "/", "");
         var element = $('ul#sidebarnav a').filter(function() {
             return this.href === url || this.href === path;// || this.href.indexOf(this.href) === 0;
         });
         element.parentsUntil(".sidebar-nav").each(function (index)
         {
             //console.log($(this));
             if($(this).is("li") && $(this).children("a").length !== 0)
             {
                 $(this).parent("ul#sidebarnav").length === 0
                     ? $(this).addClass("active")
                     : $(this).addClass("selected");

                  if ($(this).children("a").length > 0) {
                      $(this).children("a:first-child").addClass('active');
                  }
                  //$(this).children("a")[0].addClass('active');
             }
             else if(!$(this).is("ul") && $(this).children("a").length === 0)
             {
                 $(this).addClass("selected");
             }
             else if($(this).is("ul")){
                 $(this).addClass('in');
             }
         });

     element.addClass("active");
     $('#sidebarnav a').on('click', function (e) {
      //console.log('Esta entrando al eureka');
         //console.log('eureka', $(this).hasClass("active"));
             if (!$(this).hasClass("active")) {
                 // hide any open menus and remove all other classes
                 $("ul", $(this).parents("ul:first")).removeClass("in");
                 $("a", $(this).parents("ul:first")).removeClass("active");

                 // open our new menu and add the open class
                 $(this).next("ul").addClass("in");
                 $(this).addClass("active");

             }
             else if ($(this).hasClass("active")) {
                 $(this).removeClass("active");
                 $(this).parents("ul:first").removeClass("active");
                 $(this).next("ul").removeClass("in");
             }
     })
     $('#sidebarnav >li >a.has-arrow').on('click', function (e) {
         e.preventDefault();
     });
 });
}

sidebar2();
