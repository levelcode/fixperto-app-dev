import React, { Component } from 'react';
import { ScrollView, Switch, AsyncStorage, View, Image, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
const configuracion = [
	{ name: "Notificaciones", action: "notification", value: "notification" },
	{ name: "Notificaciones del chat", action: "chat", value: "notification_chat" },
]
export default class ConfiguracionsVista extends Component {
	constructor(props) {
		super(props); this.state = { textoAlert: "", showAlert: false, notification_chat: true, notification: true }
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			this.setState({ notification_chat: user["notification_chat"], notification: user["notification"] })
		})
	}
	setNotificaciones = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			var sta = Object.assign(this.state);
			this.setState({ notification: !this.state["notification"] });
			return fetch(url + 'seguridad/setNotification', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["id"], notification: (sta["notification"] === true) ? 0 : 1 })
			}).then(response => response.json()).then(responseJson => {
				if (!responseJson.success) {
					this.setState({ notification: !this.state["notification"] });
				} else {
					user["notification"] = !sta["notification"];
					AsyncStorage.setItem("@USER", JSON.stringify(user));
				}
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	setNotificacionesChat = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			var sta = Object.assign(this.state);
			this.setState({ notification_chat: !this.state["notification_chat"] });
			return fetch(url + 'seguridad/setNotificationChat', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["id"], notification_chat: (sta["notification_chat"] === true) ? 0 : 1 })
			}).then(response => response.json()).then(responseJson => {
				if (!responseJson.success) {
					this.setState({ notification_chat: !this.state["notification_chat"] })
				}
				else {
					user["notification_chat"] = !sta["notification_chat"];
					AsyncStorage.setItem("@USER", JSON.stringify(user));
				}
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	getConfigNotifications = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'seguridad/getConfigNotifications', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["id"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					var result = responseJson.result;
					this.setState({
						notification: (result["notification"]) ? true : false,
						notification_chat: (result["notification_chat"]) ? true : false
					})
				}
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	render() {
		return (
			<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<NavigationEvents onDidFocus={payload => { this.getConfigNotifications() }} />
				<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 20, alignItems: "center" }}>
					<Image source={require("../../assets/iconos/tus_datos.png")} style={{ width: 20, height: 20 }} />
					<Text style={{ fontFamily: "Raleway-Bold", marginStart: 5, fontSize: 15 }}>Notificaciones</Text>
				</View>
				<Text style={{ textAlign: "justify", marginVertical: 20, marginHorizontal: 20, fontSize: 15 }}>Al desactivar las notificacines no recibirás de primera mano las ofertas de servicios</Text>
				{
					configuracion.map((element, i) => (
						<ListItem
							key={i} bottomDivider
							containerStyle={{ borderTopWidth: 0.5, borderTopColor: "#E0E0E0" }}
							title={element.name}
							leftIcon={null}
							titleStyle={{ fontFamily: "Raleway-Regular" }}
							chevron={<Switch
								trackColor={{ false: "#767577", true: "#43AECC" }}
								thumbColor={element["value"] ? "#FFFFFF" : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
								onValueChange={(element["action"] === "chat") ? this.setNotificacionesChat : this.setNotificaciones}
								value={this.state[element["value"]]}
							/>}
						/>
					))
				}
			</ScrollView>
		)
	}
}