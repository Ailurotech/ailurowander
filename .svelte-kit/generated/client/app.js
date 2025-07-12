export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13')
];

export const server_loads = [2];

export const dictionary = {
		"/": [3],
		"/about": [4],
		"/agent": [5,[2]],
		"/agent/tours": [6,[2]],
		"/agent/tours/add": [7,[2]],
		"/agent/tours/edit/[id]": [8,[2]],
		"/agent/users": [9,[2]],
		"/contact": [10],
		"/tours": [11],
		"/tours/by-id/[id]": [13],
		"/tours/[name]": [12]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';