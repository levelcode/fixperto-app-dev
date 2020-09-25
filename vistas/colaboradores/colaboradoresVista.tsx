import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ListItem, Button } from 'react-native-elements';
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class ColaboradoresVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false } }
	getCollaborators = (id) => {
		return fetch(url + 'fixpertoEmpresa/getCollaborators', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id })
		}).then(response => response.json()).then(responseJson => {
			this.setState({ collaborators: responseJson.collaborators })
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	getCollaborator = (id) => {
		return fetch(url + 'fixpertoEmpresa/getCollaborator', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id })
		}).then(response => response.json()).then(responseJson => {
			this.props["navigation"].navigate("Colaborador", { collaborator: responseJson.collaborator })
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	deleteCollaborator = (id) => {
		return fetch(url + 'fixpertoEmpresa/deleteCollaborator', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id })
		}).then(response => response.json()).then(responseJson => {
			this.setState({ collaborators: responseJson.collaborators })
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	render() {
		return (
			<ScrollView style={{ flex: 1, backgroundColor: "#273861" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<Text style={{ fontFamily: "Raleway-Bold", textAlign: "center", color: "#FFFFFF" }}>Colaboradores</Text>
				<Text style={{ textAlign: "center", marginBottom: 10, color: "#FFFFFF" }}>Estos son tus colaboradores</Text>
				{
					this.state["collaborators"].map((item, i) => (
						<ListItem
							key={i} bottomDivider topDivider
							containerStyle={{ padding: 5 }}
							leftAvatar={<Ionicons name="ios-bulb" size={20} style={{ marginEnd: 10 }} />}
							title={<Text style={{ fontFamily: "Raleway-Bold", flex: 0.7 }}>{item.name}</Text>}
							subtitle={<View>
								<Text>Contrataciones: {item.jobs}</Text>
								<View style={{ flexDirection: "row", flex: 1, justifyContent: "center", }}>
									<TouchableOpacity onPress={() => this.getCollaborator(item.id)}>
										<Text style={{ color: "#46ADCC", textDecorationLine: "underline" }}>
											Modificar</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this.getCollaborator(item.id)}>
										<Text style={{ color: "red", textDecorationLine: "underline", marginStart: 15 }}>
											Eliminar</Text>
									</TouchableOpacity>
								</View>
							</View>}
							chevron={<Ionicons name="ios-arrow-forward" size={20} color="#46ADCC" style={{ marginHorizontal: 5 }} />}
							onPress={() => this.getCollaborator(item.id)}
						/>
					))
				}
				<Button title="AGREGAR COLABORADOR" buttonStyle={{ backgroundColor: "#43AECC" }}
					containerStyle={{ margin: 10 }}
					onPress={() => this.props["navigation"].navigate("Colaborador", { action: "add", collaborator: {} })}
				/>
				<Button title="CONTINUAR" type="outline" titleStyle={{ color: "#43AECC" }}
					buttonStyle={{ borderColor: "#43AECC" }}
					containerStyle={{ marginHorizontal: 10, marginBottom: 10 }}
					onPress={() => this.props["navigation"].navigate("RegistroCompletado")}
				/>
			</ScrollView>
		)
	}
}