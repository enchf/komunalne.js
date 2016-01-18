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

/**
 * Using Animate.css. Sets an animation to a target and quits after animation completes.
 * Includes handlers to execute before and after animation.
 * @see http://daneden.github.io/animate.css/
 */
Komunalne.anim.animation = function(effect,target,before,after) {
  var ends = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  var starts = 'webkitAnimationStart mozAnimationStart MSAnimationStart oanimationstart animationstart';
  var resolver;
  
  effect = Komunalne.util.append("animated",effect);
  target = $(target);
  resolver = function(res,rej) {
    var wrapAfter = function() {
      target.removeClass(effect);
      after(target);
      res(target);
    };
    target.addClass(effect).one(starts,before).one(ends,wrapAfter);
  };
  
  return new Promise(resolver);
};

