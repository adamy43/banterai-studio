// Small rotating eclipse for the blog pages. Same drawing as the landing hero, no pulsing.
// <canvas class="eclipse" data-r="0.34"></canvas>  r = disc radius as a fraction of the canvas' short side.
(function () {
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches
  function pn(th, k) { return Math.sin(3 * th + k * .9) * .45 + Math.sin(5 * th + k * 1.7) * .3 + Math.sin(8 * th + k * 2.9) * .17 + Math.sin(13 * th + k) * .08 }
  var items = [].slice.call(document.querySelectorAll('canvas.eclipse')).map(function (cv) {
    var o = { cv: cv, cx: cv.getContext('2d'), f: parseFloat(cv.getAttribute('data-r') || '.3') }
    o.size = function () { var r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); o.w = r.width; o.h = r.height; cv.width = r.width * d; cv.height = r.height * d; o.cx.setTransform(d, 0, 0, d, 0, 0) }
    o.size(); addEventListener('resize', o.size); return o
  })
  function draw(T) {
    items.forEach(function (o) {
      var cx = o.cx, W = o.w, H = o.h, ox = W / 2, oy = H / 2, R = Math.min(W, H) * o.f
      cx.clearRect(0, 0, W, H)
      var g = cx.createRadialGradient(ox, oy, R * .8, ox, oy, R * 2.6)
      g.addColorStop(0, 'rgba(255,96,48,.34)'); g.addColorStop(.35, 'rgba(200,50,26,.12)'); g.addColorStop(1, 'rgba(0,0,0,0)')
      cx.fillStyle = g; cx.fillRect(0, 0, W, H)
      cx.globalCompositeOperation = 'lighter'
      for (var k = 0; k < 36; k++) {
        var f = k / 36, rr = R * (1 + f * .8), amp = .022 * (.4 + f * 1.6), rot = T * (.05 + .11 * f)
        cx.beginPath()
        for (var a = 0; a <= 200; a++) { var th = a / 200 * Math.PI * 2, r = rr * (1 + amp * pn(th - rot, k * .37)); a ? cx.lineTo(ox + Math.cos(th) * r, oy + Math.sin(th) * r) : cx.moveTo(ox + Math.cos(th) * r, oy + Math.sin(th) * r) }
        cx.closePath(); cx.strokeStyle = 'rgba(255,' + Math.round(92 + f * 120) + ',' + Math.round(52 + f * 110) + ',' + (Math.pow(1 - f, 1.6) * .7).toFixed(3) + ')'; cx.lineWidth = k < 3 ? 1.6 : .8; cx.stroke()
      }
      cx.globalCompositeOperation = 'source-over'
      cx.beginPath(); cx.arc(ox, oy, R, 0, Math.PI * 2)
      var c = cx.createRadialGradient(ox, oy - R * .2, 0, ox, oy, R); c.addColorStop(0, '#0a0605'); c.addColorStop(.8, '#120705'); c.addColorStop(.955, '#4a1206'); c.addColorStop(1, '#ff6a3a')
      cx.fillStyle = c; cx.shadowColor = 'rgba(255,100,50,.9)'; cx.shadowBlur = 50; cx.fill(); cx.shadowBlur = 0
      cx.lineWidth = 2; cx.strokeStyle = 'rgba(255,190,150,.55)'; cx.stroke()
      var hg = T * .35; cx.beginPath(); cx.arc(ox, oy, R, hg, hg + 1.1); cx.strokeStyle = 'rgba(255,236,220,.95)'; cx.lineWidth = 2.6; cx.shadowColor = '#ffb08a'; cx.shadowBlur = 18; cx.stroke(); cx.shadowBlur = 0
    })
  }
  var t0 = performance.now(), base = 6
  draw(base)
  if (!still) (function loop() { draw(base + (performance.now() - t0) / 1000); requestAnimationFrame(loop) })()
})()
