// JavaScript implementation of simplex noise.
//   http://en.wikipedia.org/wiki/Simplex_noise
// Original simplex noise concept by Ken Perlin:
//   http://www.noisemachine.com/talk1/32.html
// This implementation is based on an article by Stefan Gustavson:
//   http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// globals:
// _f = random pool size
// _g, _h = random pool data
// _q = noise3 functions
for (
  _h=[_g=[i = _f = 3232]];
  i--;
)
  _g[i] = _g[i + _f] = _g[i + 2*_f] = (
      _h[i] = _h[i + _f] = _h[i + 2*_f] = Math.floor(Math.random() * _f)
  ) % 12 * 3;

function _q(x, y, z) {
  var     a,b,c,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k, 
          l = [ 1, 1, 0,    -1, 1, 0,     1,-1, 0,    
               -1,-1, 0,     1, 0, 1,    -1, 0, 1,
                1, 0,-1,    -1, 0,-1,     0, 1, 1,
                0,-1, 1,     0, 1,-1,     0,-1,-1 ],
          m,
          n = Math.floor(x+(x+y+z)/3),
          o = Math.floor(y+(x+y+z)/3),
          p = Math.floor(z+(x+y+z)/3);
  return  x -= n-(n+o+p)*(1/6),
          y -= o-(n+o+p)*(1/6),
          z -= p-(n+o+p)*(1/6),
          n = n % _f + _f,
          o = o % _f + _f, 
          p = p % _f + _f, 
          x<y?h=y<z?f=i=1:e=x<z?i=1:g=1:g=y<z?i=x<z?f=1:d=1:d=h=1,
                                                             k = 0.6 - x*x - y*y - z*z, m = k>0 ?        (k *= k) * k * (l[k = _g[n+  _h[o+  _h[p  ]]]]*x + l[++k]*y + l[++k]*z):0,
          a = x - d + 1/6, b = y - e + 1/6, c = z - f + 1/6, k = 0.6 - a*a - b*b - c*c,     k>0 && (m += (k *= k) * k * (l[k = _g[n+d+_h[o+e+_h[p+f]]]]*a + l[++k]*b + l[++k]*c)),
          a = x - g + 2/6, b = y - h + 2/6, c = z - i + 2/6, k = 0.6 - a*a - b*b - c*c,     k>0 && (m += (k *= k) * k * (l[k = _g[n+g+_h[o+h+_h[p+i]]]]*a + l[++k]*b + l[++k]*c)),
          x -= .5,          y -= .5,          z -= .5,       k = 0.6 - x*x - y*y - z*z,     k>0 && (m += (k *= k) * k * (l[k = _g[n+1+_h[o+1+_h[p+1]]]]*x + l[++k]*y + l[++k]*z)),
          32 * m;
}
