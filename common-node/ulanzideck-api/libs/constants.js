

/**
 * Events used for communicating with Ulanzi Stream Deck
 */
export const Events = Object.freeze({
	CONNECTED: 'connected',
	CLOSE: 'close',
	ERROR: 'error',
	ADD: 'add',
	RUN: 'run',
	PARAMFROMAPP: 'paramfromapp',
	PARAMFROMPLUGIN: 'paramfromplugin',
	SETACTIVE: 'setactive',
	CLEAR: 'clear',
	TOAST:'toast',
	STATE:'state',
	OPENURL:'openurl',
	OPENVIEW:'openview',
	SELECTDIALOG:'selectdialog'
});

/**
 * Errors received from WebSocket
 */
export const SocketErrors = {
	DEFAULT:'closed *****'
};


