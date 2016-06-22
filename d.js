// Untraced variables
/*
for (var y, x, N, hb, p, ha, ia, ja, ib = 0, R = 0, gb = !1, jb = 0, H = 0, Ia = 0, kb = 0, F = 0, lb = c.TOTAL_STACK || 5242880, S = c.TOTAL_MEMORY || 67108864, I = 65536; I < S || I < 2 * lb; )
    I = 16777216 > I ? 2 * I : I + 16777216;
I !== S && (S = I);
*/

// Traced D() function
// This function returns 8 every time, unless there is not enough memory, but this is temporarily ignored
var F = 0
function D(a) {
	a = a + 8
	var b = F;
    F = F + a | 0;
    F = F + 15 & -16;
    a = !0;
    n = a ? (F = b,
	0) : b
	return n + 8 & 4294967288
}

// ka() function
// This function copies a[] into y[]
var y = new Int8Array()
function ka(a, b) {
    for (var d = 0; d < a.length; d++)
        y[b++] = a[d]
}


// Untraced h object
var h = {
        ob: function(a) {
            db = a
        },
        Za: function() {
            return db
        },
        ra: function() {
            return H
        },
        ea: function(a) {
            H = a
        },
        Da: function(a) {
            switch (a) {
            case "i1":
            case "i8":
                return 1;
            case "i16":
                return 2;
            case "i32":
                return 4;
            case "i64":
                return 8;
            case "float":
                return 4;
            case "double":
                return 8;
            default:
                return "*" === a[a.length - 1] ? h.A : "i" === a[0] ? (a = parseInt(a.substr(1)),
                t(0 === a % 8),
                a / 8) : 0
            }
        },
        Wa: function(a) {
            return Math.max(h.Da(a), h.A)
        },
        yb: 16,
        bc: function(a, b) {
            "double" === b || "i64" === b ? a & 7 && (t(4 === (a & 7)),
            a += 4) : t(0 === (a & 3));
            return a
        },
        Nb: function(a, b, d) {
            return d || "i64" != a && "double" != a ? a ? Math.min(b || (a ? h.Wa(a) : 0), h.A) : Math.min(b, 8) : 8
        },
        n: function(a, b, d) {
            return d && d.length ? (d.splice || (d = Array.prototype.slice.call(d)),
            d.splice(0, 0, b),
            c["dynCall_" + a].apply(null , d)) : c["dynCall_" + a].call(null , b)
        },
        U: [],
        Oa: function(a) {
            for (var b = 0; b < h.U.length; b++)
                if (!h.U[b])
                    return h.U[b] = a,
                    2 * (1 + b);
            throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
        },
        ib: function(a) {
            h.U[(a - 2) / 2] = null
        },
        L: function(a) {
            h.L.o || (h.L.o = {});
            h.L.o[a] || (h.L.o[a] = 1,
            c.Q(a))
        },
        ma: {},
        Pb: function(a, b) {
            t(b);
            h.ma[b] || (h.ma[b] = {});
            var d = h.ma[b];
            d[a] || (d[a] = function() {
                return h.n(b, a, arguments)
            }
            );
            return d[a]
        },
        Ob: function() {
            throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work";
        },
        da: function(a) {
            var b = H;
            H = H + a | 0;
            H = H + 15 & -16;
            return b
        },
        Ja: function(a) {
            var b = R;
            R = R + a | 0;
            R = R + 15 & -16;
            return b
        },
        F: function(a) {
            var b = F;
            F = F + a | 0;
            F = F + 15 & -16;
            if (a = F >= S)
                G("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + S + ",  (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which adjusts the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 "),
                a = !0;
            return a ? (F = b,
            0) : b
        },
        ja: function(a, b) {
            return Math.ceil(a / (b ? b : 16)) * (b ? b : 16)
        },
        Wb: function(a, b, d) {
            return d ? +(a >>> 0) + 4294967296 * +(b >>> 0) : +(a >>> 0) + 4294967296 * +(b | 0)
        },
        Na: 8,
        A: 4,
        zb: 0
    };
