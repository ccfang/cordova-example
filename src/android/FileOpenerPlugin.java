package org.gk.cordova.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;
import android.net.Uri;

public class FileOpenerPlugin extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		boolean result = true;
		if ("open".equals(action)) {
			String url = args.getString(0);
			Uri uri = Uri.parse(url);
			if (url.contains(".pdf")) {
				final Intent intent = new Intent(Intent.ACTION_VIEW);
				intent.setDataAndType(uri, "application/pdf");
				cordova.getThreadPool().execute(new Runnable() {

					@Override
					public void run() {
						cordova.getActivity().startActivity(intent);
					}
				});
			}
		} else {
			result = false;
		}
		return result;
	}
}
