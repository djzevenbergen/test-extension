// If your extension doesn't need a background script, just leave this file empty

messageInBackground("first");

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export function messageInBackground(input) {
  console.log(input);
  console.log('just do not forget, I cannot render anything !');
}


