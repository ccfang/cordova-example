package org.gk.cordova.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;

public class SharePlugin extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		boolean result = true;
		if ("send".equals(action)) {
			String title = args.getString(0);
			String text = args.getString(1);
			final Intent intent = new Intent(Intent.ACTION_SEND);
			intent.setType("text/plain");
			intent.putExtra(Intent.EXTRA_SUBJECT, title);
			intent.putExtra(Intent.EXTRA_TEXT, text);
			cordova.getThreadPool().execute(new Runnable() {

				@Override
				public void run() {
					cordova.getActivity().startActivity(intent);
				}
			});
		} else {
			result = false;
		}
		return result;
	}
}
