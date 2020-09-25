import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { NavigationEvents } from 'react-navigation';
import { View, KeyboardAvoidingView, Platform, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import Experto from "../../componentes/expertoVista";
import Cliente from "../../componentes/clienteVista";
import Copy from "../../componentes/copyVista";
import { general } from "../../style/chat";
import { socket } from "../../componentes/socket";
import { url } from "../../componentes/config";
export default class ChatVista extends Component {
	constructor(props) {
		super(props);
		this.state = {
			textoAlert: "", showAlert: false, messages: [],
			to: this.props["navigation"].getParam("chat").to["userId"],
			request: this.props["navigation"].getParam("chat").request,
			user: this.props["navigation"].getParam("chat").user,
			type: this.props["navigation"].getParam("chat").type,
		};
		this.onReceivedMessage = this.onReceivedMessage.bind(this);
		this.onSend = this.onSend.bind(this);
		this._storeMessages = this._storeMessages.bind(this);
		socket.on('message', (messages, de, request, type, user, action) => { this.onReceivedMessage(messages, de, request, type, user, action) });
	}
	getMessages = () => {
		return fetch(url + 'seguridad/getMessages', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ request: this.state["request"], user: this.state["user"].userId, to: this.state["to"] })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.setState({ messages: responseJson.messages }); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
			}
		})
	}
	onReceivedMessage(messages, de, request, type, user, action) { this._storeMessages(messages); }
	onSend(messages = []) {
		messages[0]["id"] = messages[0]["_id"];
		socket.emit('message', messages[0], this.state["to"], this.state["request"], this.state["type"], this.state["user"], (this.props["navigation"].getParam("chat").action) ? this.props["navigation"].getParam("chat").action : "", this.props["navigation"].getParam("chat").to, this.props["navigation"].getParam("chat").to["token"]);
		this._storeMessages(messages);
	}
	_storeMessages(messages) {
		this.setState((previousState) => {
			return { messages: GiftedChat.append(previousState["messages"], messages) };
		});
	}
	editarServicio = () => {
		return fetch(url + 'fixperto/getOffert', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ expert: (this.state["user"]["typeId"]) ? this.state["user"]["typeId"] : this.state["user"]["id"], request: this.state["request"] })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				this.props["navigation"].navigate("RealizarOferta", {
					action: (responseJson.offert["status"] === "completed") ? "show" : "mod",
					expert: (this.state["user"]["typeId"]) ? this.state["user"]["typeId"] : this.state["user"]["id"],
					request: this.state["request"],
					offert: responseJson.offert, solicitud: responseJson.solicitud
				});
			}
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				/*this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });*/
			}
		})
	}
	verServicio = () => {
		this.props["navigation"].navigate("VerOferta", {
			expert: (this.props["navigation"].getParam("chat")["to"]["typeId"]) ? this.props["navigation"].getParam("chat")["to"]["typeId"] : this.props["navigation"].getParam("chat")["to"]["id"],
			request: this.state["request"]
		})
	}
	render() {
		var user = { _id: this.state["user"].userId || -1 };
		return (
			<View style={{ flex: 1 }}>
				<NavigationEvents onDidFocus={payload => { this.getMessages(); }} />
				{(this.state["type"] === "cliente") ?
					<View style={[general.container, { marginVertical: 0 }]}>
						<View style={[general.cont_chat, { marginVertical: 0 }]}>
							<Experto experto={this.props["navigation"].getParam("chat").to} navigation={this.props["navigation"]} />
						</View>
						<Button title="VER SERVICIO" buttonStyle={{ backgroundColor: "#42AECB" }}
							type="solid" containerStyle={{ marginHorizontal: 10, marginTop: 5 }}
							onPress={() => this.verServicio()} />
						<Copy texto="Nuestros fixpertos están atentos a tus necesidades para solucionarlas pronto" />
					</View> : <View>
						<View style={[general.cont_chat, { marginVertical: 0 }]}>
							<Cliente cliente={this.props["navigation"].getParam("chat").to} navigation={this.props["navigation"]} />
						</View>
						<Button title={(this.props["navigation"].getParam("chat").action === "mod") ? "EDITAR SERVICIO" : "VER SERVICIO"} buttonStyle={{ backgroundColor: "#42AECB" }}
							type="solid" containerStyle={{ marginHorizontal: 10, marginTop: 5 }}
							onPress={() => this.editarServicio()}
						/>
						<Copy texto="Cada vez que usted acuerde un servicio por el chat, debe enviarle la propuesta a su cliente para la aprobación del servicio" />
					</View>
				}
				<GiftedChat
					messages={this.state["messages"]}
					onSend={this.onSend}
					user={user}
				/>
				<KeyboardAvoidingView behavior={(Platform.OS === "android") ? "padding" : "height"} keyboardVerticalOffset={80} />
			</View>
		);
	}
}