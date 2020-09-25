import React, { Component } from 'react';
import { View, Text, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { url } from "../../componentes/config";
export default class PagoEpaycoVista extends Component {
	constructor(props) { super(props); }
	render() {
		const name = this.props["navigation"].getParam("name");
		const price = this.props["navigation"].getParam("price");
		const id = this.props["navigation"].getParam("id");
		const type = this.props["navigation"].getParam("type");
		const expert = this.props["navigation"].getParam("expert");
		return (
			<View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", padding: 20 }}>
				<Text style={{ marginHorizontal: 10, fontSize: 17, marginBottom: 10 }}>ePayco es la pasarela de pagos encargada del pago en línea.
				{
						<Text style={{ color: "#263762", textDecorationLine: "underline", fontFamily: "Raleway-Bold" }}
							onPress={() => { Linking.openURL('https://epayco.co/') }}> Más información aquí</Text>
					}
				</Text>
				<WebView
					originWhitelist={['*']}
					javaScriptEnabled={true}
					allowFileAccess
					domStorageEnabled
					allowUniversalAccessFromFileURLs
					allowFileAccessFromFileURLs
					source={{ uri: url + `epayco/getHtml?name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&id=${encodeURIComponent(id)}&expert=${encodeURIComponent(expert)}&type=${encodeURIComponent(type)}` }}
					onMessage={event => {
						if (event.nativeEvent.data === "goBack") { this.props["navigation"].navigate("PerfilFixperto"); }
					}}
				/>
			</View>
		)
	}
}