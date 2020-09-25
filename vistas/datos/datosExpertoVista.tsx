import React, { Component } from 'react';
import { View, ScrollView, Image, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class DatosExpertoVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, expert: {}, jobs: [], certifications: [], comments: [] } }
	componentDidMount() { this.getDatos(); }
	getDatos = () => {
		return fetch(url + 'fixperto/getExpertData', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ expert: this.props["navigation"].getParam("expert") })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				var jobs = [];
				var type = (responseJson.expert["type"] === 0) ? "profesional/" : "empresa/";
				for (let index = 0; index < responseJson["jobs"].length; index++) {
					jobs.push({
						uri: url + "uploads/registros/" + type + "jobs/" + responseJson["jobs"][index]["job"]
					})
				}
				this.setState({ expert: responseJson.expert, jobs, certifications: responseJson.certifications, comments: responseJson.comments });
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	keyExtractor = (item, index) => index.toString();
	render() {
		const typo = (this.state["expert"]["type"] === 0) ? "profesional/" : "empresa/";
		const { expert, jobs, certifications, comments } = this.state;
		return (
			<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", padding: 20 }}>
					<View style={{ borderRadius: 5, alignItems: "center", marginVertical: 5, padding: 10 }}>
						<Image
							style={{ width: 100, height: 100, borderRadius: 10 }}
							source={{ uri: url + "uploads/registros/" + typo + "/" + expert["avatar"] }}>
						</Image>
					</View>
					<View style={{ flex: 0.95 }}>
						<View style={{ flex: 1, flexDirection: "row" }}>
							<View style={{ flex: 0.7 }}>
								{expert.plan === 1 &&
									<Image source={require("../../assets/iconos/experto_premium.png")} style={{ width: 100, height: 20 }} />}
							</View>
							<View style={{ flex: 0.3 }}>
								{
									(expert.evaluation) ?
										<Text style={[{ marginHorizontal: 0 }]}>
											<Ionicons name="ios-star" size={15} color="#FFCE07" />
											{expert.evaluation}
										</Text>
										:
										<View>
											<Text></Text>
											<Text style={[{ marginHorizontal: 0, fontSize: 10 }]}>
												<Ionicons name="ios-star" size={15} color="#FFCE07" /> Sin
										</Text>
											<Text style={[{ marginHorizontal: 0, fontSize: 10 }]}>
												calificación
										</Text>
										</View>
								}
							</View>
						</View>
						<Text style={{ fontSize: 20, color: "#263762", fontFamily: "Raleway-Bold", marginBottom: 5, textAlign: "left", flex: 0.95, marginRight: 10 }}>{expert.name}</Text>
					</View>
				</View>
				<View style={{ marginHorizontal: 10, padding: 20 }}>
					<Text style={{ fontSize: 20, marginVertical: 10, fontFamily: "Raleway-Bold", color: "#263762" }}>Perfil profesional </Text>
					<Text style={{ textAlign: "justify", marginBottom: 10, fontFamily: "Raleway-Regular", fontSize: 15 }}>{expert.profile_description}</Text>
				</View>
				<View style={{ backgroundColor: "#F8F8F8", padding: 20 }}>
					<Text style={{ marginHorizontal: 10, fontSize: 20, marginTop: 10, fontFamily: "Raleway-Bold", color: "#263762" }}>Seguridad social</Text>
					<View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
						{expert.salud_pension && <View>
							<Ionicons name="ios-checkmark-circle" size={20} color="#8FB464" />
							<Text style={{ marginStart: 5, fontSize: 15 }}>Parafiscales</Text>
						</View>}
						{expert.arl && <View>
							<Ionicons name="ios-checkmark-circle" size={20} color="#8FB464" style={{ marginStart: 15 }} />
							<Text style={{ marginStart: 5, fontSize: 15 }}>ARL</Text>
						</View>}
					</View>
					{/*expert.insured === 1 && <View style={{ flexDirection: "row", marginBottom: 5, alignItems: "center", marginHorizontal: 10 }}>
						<Image source={require("../../assets/iconos/asegurado.png")} style={{ width: 20, height: 20 }} />
						<Text style={{ marginStart: 5, fontSize: 15 }}>Asegurado</Text>
					</View>*/}
					{certifications.length > 0 && <Text style={{ marginHorizontal: 10, fontSize: 20, marginTop: 10, fontFamily: "Raleway-Bold", color: "#263762", marginBottom: 10 }}>
						Certificaciones
					</Text>}
					{certifications.length > 0 && <View>
						{certifications.map((cert, i) => (
							<View key={i} style={{ flexDirection: "row", marginBottom: 5, alignItems: "center", marginHorizontal: 10 }}>
								<Image source={{ uri: cert["imagen"] }} style={{ width: 20, height: 20 }} />
								<Text style={{ marginStart: 5, fontSize: 15 }}>{cert["denomination"]}</Text>
							</View>
						))}
					</View>
					}
				</View>
				{jobs.length > 0 && <View style={{ marginHorizontal: 10, padding: 20 }}>
					<Text style={{ fontSize: 20, marginVertical: 10, fontFamily: "Raleway-Bold", color: "#263762" }}>Proyectos</Text>
					<FlatList data={jobs} horizontal
						renderItem={({ item, index }) =>
							<View key={index} style={{ marginHorizontal: 5, marginBottom: 10, borderWidth: 0.5, borderRadius: 7, borderColor: "silver" }}>
								<Image style={{ width: 80, height: 80, borderRadius: 7 }} source={{ uri: item.uri }} />
							</View>
						}
						keyExtractor={this.keyExtractor} />
				</View>}
				{comments.length > 0 && <Text style={{ marginHorizontal: 10, fontSize: 20, marginBottom: 10, fontFamily: "Raleway-Bold", color: "#263762", padding: 20 }}>
					Comentarios de clientes
				</Text>}
				{comments.length > 0 && comments.map((item, index) => {
					return <View key={index} style={{ marginBottom: 20, padding: 20 }} >
						<View style={{ marginHorizontal: 10, flexDirection: "row", alignItems: "center", marginTop: 5 }}>
							<Ionicons name="ios-star" size={20} color="#FFCE07" />
							<Text style={{ marginLeft: 5 }}>{(item.evaluation) ? item.evaluation : 0}</Text>
						</View>
						<Text style={{ textAlign: "justify", paddingHorizontal: 10, marginTop: 5 }}>{item.commentary}</Text>
						<Text style={{ textAlign: "justify", paddingHorizontal: 10, marginBottom: 10, color: "silver", marginTop: 3 }}>{item.name}</Text>
					</View>
				})}
			</ScrollView>
		)
	}
}