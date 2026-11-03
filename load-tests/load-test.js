import http from 'k6/http';
import { check, sleep } from 'k6';

// The load grows step by step: 10 users, then 50, then 100, then it goes down.
export const options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        // The test fails if more than 1% of the requests fail
        http_req_failed: ['rate<0.01'],
        // ... or if 95% of the requests take more than 1 second
        http_req_duration: ['p(95)<1000'],
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost';

function visit(name, path) {
    const res = http.get(`${BASE_URL}${path}`);
    check(res, { [`${name} is 200`]: (r) => r.status === 200 });
    if (res.status !== 200) {
        console.log(`FAIL page=${name} status=${res.status} error="${res.error}" time=${Math.round(res.timings.duration)}ms`);
    }
}

export default function () {
    visit('home page', '/');
    visit('books API', '/api/books');
    visit('pokedex', '/pokedex/');
    sleep(1);
}