/* Цех — движение 10.09. Источник: reels/10-09-26/MOTION.md, раздел «Движение».
   Вход 0.42–0.62 power4.out · шаг 0.08 · покой 0.9 + 0.28×слов, не меньше 1.6
   Выход 0.30 power2.in + жёсткое гашение · сдвиг ≤34 px · масштаб 0.96→1.0 */

window.HF = (function () {
  var FPS = 30;

  var M = {
    enter: 0.52,
    enterEase: "power4.out",
    step: 0.08,
    exit: 0.3,
    exitEase: "power2.in",
    shift: 34,
    scaleFrom: 0.96,
    frame: 1 / FPS,
    numberResize: 0.18,
    drawLine: 0.42,
    zoom: 0.8,
    zoomEase: "power2.inOut",
  };

  /** покой: 0.9 + 0.28 × слов, не меньше 1.6 с */
  function hold(words) {
    return Math.max(1.6, 0.9 + 0.28 * words);
  }

  /** спрятать до появления. Немедленный gsap.set, а не tl.set(…, 0):
      нулевой set в позиции 0 не отрисовывается, когда голова стоит ровно на 0,
      и кадр 0 показал бы непрятанное состояние. */
  function hide(tl, target) {
    gsap.set(target, { autoAlpha: 0 });
    return tl;
  }

  /** немедленно выставить свойство до старта таймлайна */
  function preset(target, props) {
    gsap.set(target, props);
  }

  /** вход: сдвиг ≤34, масштаб 0.96→1.0, power4.out */
  function enter(tl, target, at, dur) {
    tl.fromTo(
      target,
      { autoAlpha: 0, y: M.shift, scale: M.scaleFrom },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: dur || M.enter,
        ease: M.enterEase,
        overwrite: "auto",
      },
      at,
    );
    return tl;
  }

  /** несколько элементов подряд шагом 0.08 */
  function enterStagger(tl, targets, at, dur) {
    targets.forEach(function (t, i) {
      enter(tl, t, at + i * M.step, dur);
    });
    return tl;
  }

  /** выход: 0.30 power2.in, жёсткое гашение — без кроссфейда */
  function exit(tl, target, at, dur) {
    tl.to(
      target,
      {
        autoAlpha: 0,
        duration: dur || M.exit,
        ease: M.exitEase,
        overwrite: "auto",
      },
      at,
    );
    return tl;
  }

  /** акцентная линия: целиком за 1 кадр. Удар, не рост. */
  function ruleHit(tl, target, at) {
    tl.set(target, { autoAlpha: 1 }, at);
    return tl;
  }

  /** крупное число: без подъёма, resize 0.9→1.0 за 0.18 с */
  function number(tl, target, at) {
    tl.set(target, { autoAlpha: 1 }, at);
    tl.fromTo(
      target,
      { scale: 0.9 },
      { scale: 1, duration: M.numberResize, ease: M.enterEase, overwrite: "auto" },
      at,
    );
    return tl;
  }

  /** линия прочерчивается слева направо */
  function draw(tl, target, at, dur) {
    tl.set(target, { autoAlpha: 1 }, at);
    tl.fromTo(
      target,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: dur || M.drawLine,
        ease: M.enterEase,
        overwrite: "auto",
      },
      at,
    );
    return tl;
  }

  /** подсветка слова: меняется ТОЛЬКО цвет, геометрия неподвижна.
      Отдельное событие на слово — не тег внутри строки. */
  function highlightWord(tl, target, at, color) {
    tl.set(target, { color: color || "var(--accent)" }, at);
    return tl;
  }

  /** зум на интерфейс: 0.80 power2.inOut, камера полностью останавливается */
  function zoomTo(tl, target, at, props) {
    tl.to(
      target,
      Object.assign({ duration: M.zoom, ease: M.zoomEase, overwrite: "auto" }, props),
      at,
    );
    return tl;
  }

  return {
    M: M,
    hold: hold,
    hide: hide,
    preset: preset,
    enter: enter,
    enterStagger: enterStagger,
    exit: exit,
    ruleHit: ruleHit,
    number: number,
    draw: draw,
    highlightWord: highlightWord,
    zoomTo: zoomTo,
  };
})();
