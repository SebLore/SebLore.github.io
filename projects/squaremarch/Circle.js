
/**
 * Circle
 * @param {number} x 
 * @param {number} y 
 * @param {number} r
 * 
 * Constructor for a circle object, takes in x coord, y coord and radius.
 */

function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.elapsed = 0.0; // time tracking

    /**
     * implicitFunction
     * @param {number} x 
     * @param {number} y 
     * @returns {number} < 0 if outside, > 0 if inside
     */
    this.Implicit = function (x, y) {
        return Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2) - this.r;
    }

    this.Intersects = function (x0, y0, x1, y1) {
        let dx = x1 - x0; // distance in x
        let dy = y1 - y0; // distance in y
        let dr = Math.sqrt(dx ** 2 + dy ** 2); // length of the line segment
        let det = x0 * y1 - x1 * y0; // determinant of the line segment, needed for the intersection
        let disc = this.r ** 2 * dr ** 2 - det ** 2; // 

        if (disc < 0)
            return [];

        let x = (det * dy + Math.sign(dy) * dx * Math.sqrt(disc)) / dr ** 2;
        let y = (-det * dx + Math.abs(dy) * Math.sqrt(disc)) / dr ** 2;
        return [x, y];
    }

    this.GetIntersections = function (x0, y0, x1, y1) {
        let intersections = this.Intersects(x0, y0, x1, y1);
        if (intersections.length === 0) return [];
        let t = (intersections[0] - x0) / (x1 - x0);
        if (t < 0 || t > 1) return [];
        return [intersections];
    }

    this.GetNormal = function (x, y) {
        return [x - this.x, y - this.y];
    }

    this.Update = function (dt) {
        const speed = 3.0;
        const omega = 2 * Math.PI / speed;
        this.elapsed = (this.elapsed + omega * dt) % (2 * Math.PI); // wrap around
        this.elapsed %= 2 * Math.PI; // wrap around

        this.x = Math.sin(this.elapsed) * this.r;
        this.y = Math.cos(this.elapsed) * this.r;
    }
}


/**
 * Clock
 * 
 * Simple delta timer to track frame updates
 */

function Clock() {
    this.last = Date.now();

    this.delta = function () {
        let now = Date.now();
        let delta = now - this.last;
        this.last = now;
        return delta * 0.001;
    }

    this.Reset = function () {
        this.last = 0.0;
    }
}