package org.gk.cordova.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.widget.Toast;

public class ToastPlugin extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		boolean result = true;
		final String text = args.getString(0);
		int length = 0;
		if ("short".equals(action)) {
			length = Toast.LENGTH_SHORT;
		} else if ("long".equals(action)) {
			length = Toast.LENGTH_LONG;
		} else {
			result = false;
		}

		if (result) {
			cordova.getActivity().runOnUiThread(
					new ToastRun(cordova.getActivity().getApplicationContext(),
							text, length));
		}
		return result;
	}

	private class ToastRun implements Runnable {

		private Context context;
		private String text;
		private int duration;

		public ToastRun(Context context, String text, int duration) {
			this.context = context;
			this.text = text;
			this.duration = duration;
		}

		@Override
		public void run() {
			Toast.makeText(context, text, duration).show();
		}
	}
}
