/**
 * CSS Animation utils.
 */

/**
 * Using Animate.css. Sets an animation to a target and quits after animation completes.
 * @see http://daneden.github.io/animate.css/
 */
Komunalne.anim.animate = function(effect,target) {
  var ends = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  return new Promise(function(resolve,reject) {
    effect = Komunalne.util.append("animated",effect);
    $(target).addClass(effect).one(ends,function() {
      $(this).removeClass(effect);
      resolve(this);
    });
  });
};
