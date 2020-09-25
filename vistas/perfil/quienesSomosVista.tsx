import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
export default class QuienesSomosVista extends Component {
	constructor(props) { super(props); }
	render() {
		return (
					<WebView
						originWhitelist={['*']}
						javaScriptEnabled={true}
						allowFileAccess
						domStorageEnabled
						allowUniversalAccessFromFileURLs
						allowFileAccessFromFileURLs
						source={{ uri: "https://backoffice.fixperto.com/quienes-somos/" }}
						style={{ marginHorizontal: 5, backgroundColor: "#FFFFFF" }}
					/>
		)
	}
}