import * as vscode from 'vscode';

let statusBar: vscode.StatusBarItem;
let pomodoro: any;
let defaultPomodoroMinutes: number = 25;
let minutes: number = defaultPomodoroMinutes;
let seconds: number = 59;

export function activate(context: vscode.ExtensionContext) {	
		
	statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

	let pomodoroStart = vscode.commands.registerCommand('developingthedeveloper-dev-pomodoro-timer.startPomodoro', () => {		
		start();
	});

	let pomodoroReset = vscode.commands.registerCommand('developingthedeveloper-dev-pomodoro-timer.resetPomodoro', () => {		
		reset();
	});

	let pomodoroPause = vscode.commands.registerCommand('developingthedeveloper-dev-pomodoro-timer.pausePomodoro', () => {		
		pause();
	});

	let pomodoroResume = vscode.commands.registerCommand('developingthedeveloper-dev-pomodoro-timer.resumePomodoro', () => {		
		resume();
	});

	//Settings
	defaultPomodoroMinutes = vscode.workspace.getConfiguration()
		.get("pomodoro.minutes") ?? defaultPomodoroMinutes;

	defaultPomodoroMinutes--;
	minutes = defaultPomodoroMinutes;

	context.subscriptions.push(statusBar);
	context.subscriptions.push(pomodoroStart);
	context.subscriptions.push(pomodoroReset);
	context.subscriptions.push(pomodoroPause);
	context.subscriptions.push(pomodoroResume);
}

export function deactivate() {}

function start(): void {

	pomodoro = setInterval(() => {
		
		label();

		if (minutes === 0 && seconds === 0) {
			finished();
		}

		if (seconds === 0) {
			minutes--;
			seconds = 59;
		}

		seconds--;

	}, 1000);

}

function resume(): void {
	start();
}

function pause(): void {
	clearInterval(pomodoro);
}

function reset(): void {
	clearInterval(pomodoro);
	minutes = defaultPomodoroMinutes;
	seconds = 59;	
	label();
}

async function finished(): Promise<void> {

	reset();

	let notification: boolean = vscode.workspace.getConfiguration()
	.get("pomodoro.notification") ?? false;

	if (notification) {

		const selection = await vscode.window.showWarningMessage('Pomodoro finished', 'Start again', 'Close');
		
		if (selection !== undefined) {
			if (selection === "Start again") {
				start();
			}
		}
	}

}

function label(): void {

	let label: string = vscode.workspace.getConfiguration()
		.get("pomodoro.status.bar.label") ?? "{mm}:{ss}";

	label = label.replace("{mm}", minutes.toString());
	label = label.replace("{ss}", seconds.toString());

	statusBar.text = label;
	statusBar.show();

}
