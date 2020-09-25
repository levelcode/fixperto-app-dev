import React, { Component } from 'react';
import { ScrollView, Text, View, AsyncStorage, Image } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { ListItem, Badge } from 'react-native-elements';
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
import * as FileSystem from 'expo-file-system';
export default class ChatListVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, chats: [], notifications: [] } }
	getChats = () => {
		FileSystem.readAsStringAsync(FileSystem.documentDirectory + '/config.json')
			.then((contenido) => {
				contenido = JSON.parse(contenido);
				var notifications = contenido["notifications"];
				AsyncStorage.getItem("@USER").then((user) => {
					user = JSON.parse(user);
					return fetch(url + 'seguridad/getChats', {
						method: "POST",
						headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
						body: JSON.stringify({ user: user["id"] })
					}).then(response => response.json()).then(responseJson => {
						if (responseJson.success) {
							var chats = responseJson.chats;
							chats.map((chat, ind) => {
								let aux = notifications.filter(noti => noti["request"] === chat["request"] && noti["de"] === chat["id"]);
								chats[ind]["notifications"] = aux.length;
							});
							this.setState({ notifications, chats });
						}
						else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
					}).catch((error) => {
						if (error.message === 'Timeout' || error.message === 'Network request failed') {
							this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
						}
					})
				})
			})
	}
	getChat = (datos) => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			var urll = (datos["type"] === "cliente") ? url + "cliente/getCustomer" : url + "fixperto/getExpert";
			return fetch(urll, {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: datos["typeId"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					FileSystem.readAsStringAsync(FileSystem.documentDirectory + '/config.json')
						.then((contenido) => {
							contenido = JSON.parse(contenido);
							contenido["notifications"] = contenido["notifications"].filter(noti => noti["request"] !== datos["request"] && noti["de"] !== datos["de"]);
							FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify(contenido));
						})
					this.props["navigation"].navigate("Chat", {
						_emitter: this.props["navigation"].getParam("_emitter"),
						chat: { to: responseJson.result, user, request: datos["request"], type: (datos["type"] === "cliente") ? "experto" : "cliente", offert: datos["offert"], action: datos["action"] }
					})
				}
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		})
	}
	render() {
		return (
			<ScrollView style={{ backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<NavigationEvents onDidFocus={payload => { this.getChats(); }} />
				{
					this.state["chats"].map((chat, i) => (
						<ListItem
							key={i} bottomDivider topDivider
							containerStyle={{ backgroundColor: (chat.offer) ? "#ECF7F9" : "#FFFFFF" }}
							leftAvatar={
								<Image
									style={{ width: 50, height: 50, borderRadius: 10 }}
									source={{
										uri: (chat.type === "cliente") ? url + "uploads/registros/cliente/" + chat["avatar"] :
											(chat.type === "profesional") ? url + "uploads/registros/profesional/" + chat["avatar"] :
												url + "uploads/registros/empresa/" + chat["avatar"]
									}}>
								</Image>
							}
							title={<Text style={{ fontFamily: "Raleway-Bold", flex: 0.8 }}>{chat.name}</Text>}
							subtitle={<Text> {chat.denomination}</Text>}
							chevron={
								<View style={{ alignItems: "center" }}>
									<Text>{chat.date}</Text>
									<Badge
										containerStyle={{ marginTop: 10, display: (chat["notifications"] !== 0) ? "flex" : "none" }}
										badgeStyle={{ width: 30, height: 30, borderRadius: 15 }}
										textStyle={{ fontWeight: "bold", color: "#FFFFFF", marginBottom: 3 }}
										value={chat["notifications"]} status="primary"
									/>
								</View>
							}
							onPress={() => this.getChat({ de: chat["id"], type: chat["type"], typeId: chat["typeId"], request: chat["request"], offert: chat["offert"], action: chat["action"] })}
						/>
					))
				}
			</ScrollView>
		);
	}
}