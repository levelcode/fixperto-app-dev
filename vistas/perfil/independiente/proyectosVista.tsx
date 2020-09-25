import React, { Component } from 'react';
import { View, TouchableOpacity, AsyncStorage, FlatList, SafeAreaView, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Image } from 'react-native-elements';
import DocumentVista from "../../../componentes/documentVista";
import AlertModal from "../../../componentes/alertView";
import { url } from "../../../componentes/config";
export default class ProyectosIndependienteVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, buttonDisabled: false, jobs: [], user: {}, isModalVisible: false, photo: "", description: "" } }
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.getJobs(user); })
	}
	getJobs = (user) => {
		return fetch(url + 'fixpertoProfesional/getJobsProfesional', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: user["typeId"] })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				var jobs = []
				for (let index = 0; index < responseJson["jobs"].length; index++) {
					jobs.push({
						uri: url + "uploads/registros/profesional/jobs/" + responseJson["jobs"][index]["job"],
						description: responseJson["jobs"][index]["description"],
						id: responseJson["jobs"][index]["id"]
					})
				}
				this.setState({ user, jobs, isModalVisible: false, photo: "", description: "" });
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	keyExtractor = (item, index) => index.toString()
	delJob(id) {
		return fetch(url + 'fixperto/delJob', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.getJobs(this.state["user"]); }
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	adicionar = () => {
		let vacios = [];
		if (this.state["photo"] === "") { vacios.push("  *Imagen"); }
		if (this.state["description"] === "") { vacios.push("  *Descripción"); }
		if (vacios.length) {
			return this.setState({ showAlert: true, textoAlert: "Los siguientes campos son obligatorios: " + vacios.toString() });
		}
		else {
			this.setState({ buttonDisabled: true });
			const createFormData = () => {
				const convertirImagen = (result) => {
					var name = Math.random().toString(36).substring(7, 15) + Math.random().toString(36).substring(7, 15);
					name = name + "_" + Date.now().toString();
					let localUri = result.uri;
					let filename = localUri.split('/').pop();
					let match = /\.(\w+)$/.exec(filename);
					let type = match ? `image/${match[1]}` : `image`;
					return { uri: localUri, name: this.state["user"]["typeId"] + name + match[0], type }
				}
				const data = new FormData();
				data.append("id", this.state["user"]["typeId"]);
				data.append("description", this.state["description"]);
				data.append("job", convertirImagen(this.state["photo"]));
				return data;
			};
			return fetch(url + 'fixpertoProfesional/addJobProfesional', {
				method: "POST", headers: { Accept: 'application/json', "Access-Token": globalThis.tokenAuth }, body: createFormData()
			}).then(response => response.json()).then(responseJson => {
				this.setState({ buttonDisabled: false });
				if (responseJson.success) { this.getJobs(this.state["user"]) }
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
			})
				.catch((error) => {
					this.setState({ buttonDisabled: false });
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		}

	}
	render() {
		const { jobs, isModalVisible, photo, description } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 10, justifyContent: "center" }}>
					<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", fontSize: 18, color: "#999797" }}>Adjunta tus proyectos</Text>
					<TouchableOpacity style={{ flex: 0.3, alignItems: "flex-end" }}
						onPress={() => { this.setState({ isModalVisible: true }) }} >
						<Ionicons name="ios-add" color="#43AECC" size={25} style={{ marginHorizontal: 5 }} />
					</TouchableOpacity>
				</View>
				<SafeAreaView style={{ marginBottom: 10, marginHorizontal: 5, alignItems: "center" }}>
					<FlatList data={jobs} numColumns={2}
						renderItem={({ item, index }) =>
							<View style={{ marginLeft: 15, width: 120, marginTop: 30 }}>
								<Image style={{ width: 115, height: 115 }} source={{ uri: item["uri"] }} >
									<Ionicons name="ios-close-circle" color="#CE4343" size={30} style={{ position: 'absolute', right: -5, top: -10 }}
										onPress={() => { this.delJob(item.id) }} />
								</Image>
								<Text numberOfLines={4} ellipsizeMode="tail" style={{ textAlign: "center", fontFamily: "Raleway-Regular", fontSize: 18, marginVertical: 10 }}>{item["description"]}</Text>
							</View>}
						keyExtractor={this.keyExtractor} />
				</SafeAreaView>
				<Modal visible={isModalVisible}>
					<View style={{ flex: 1, marginVertical: 35 }}>
						<View style={{ alignItems: "center", justifyContent: "center" }}>

							<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Imagen*</Text>
							<Image source={(photo !== "") ? { uri: photo.uri } : require("../../../assets/icon.png")} style={{ width: 120, height: 120, marginBottom: 5 }} />
							<DocumentVista selectDocuments={(photo) => { this.setState({ photo }) }} />
							<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Descripción del trabajo*</Text>
							<Input
								inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
								inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
								value={description} onChangeText={(description) => this.setState({ description })}
							/>

							<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
								<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
							</View>

							<View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
								<Button title="GUARDAR" buttonStyle={{ backgroundColor: "#43AECC", marginRight: 5 }}
									titleStyle={{ fontFamily: "Raleway-Bold" }}
									disabled={this.state["buttonDisabled"]}
									onPress={() => this.adicionar()}
								/>
								<Button type="outline" title="CANCELAR"
									buttonStyle={{ borderColor: "#CE4343", marginLeft: 5, borderWidth: 1 }}
									titleStyle={{ fontFamily: "Raleway-Bold", color: "#CE4343" }}
									disabled={this.state["buttonDisabled"]}
									onPress={() => this.setState({ isModalVisible: false })}
								/>
							</View>
						</View>
					</View>
				</Modal >
			</View>
		)
	}
}