import React, { Component } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Text } from 'react-native';
import { Button, ListItem, Icon } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import Copy from "../../../../componentes/copyVista";
import { buttons, textos } from "../../../../style/style";

export default class RegistroEmpresa4Vista extends Component {
	constructor(props) { super(props); this.state = { collaborators: [] } }
	addColaborador = () => {
		this.props["navigation"].navigate("Colaborador", { action: "add", ruta: "RegistroEmpresa4", categories: this.props["navigation"].getParam("informacion").categoriesSelected, categoriesEmergency: this.props["navigation"].getParam("informacion").categoriesEmergencySelected })
	}
	omitir = () => {
		let informacion = this.props["navigation"].getParam("informacion");
		informacion["categoriesSelected"] = informacion["categoriesSelected"].concat(informacion["categoriesEmergencySelected"]);
		delete informacion["categoriesEmergencySelected"];
		this.props["navigation"].navigate("RegistroCompletado", { type: "emp", informacion })
	}
	continuar = () => {
		let informacion = this.props["navigation"].getParam("informacion");
		informacion["categoriesSelected"] = informacion["categoriesSelected"].concat(informacion["categoriesEmergencySelected"]);
		delete informacion["categoriesEmergencySelected"];
		if (this.state["collaborators"].length) {
			for (let index = 0; index < this.state["collaborators"].length; index++) {
				let categories = [];
				let cate = this.state["collaborators"][index]["categoriesSelected"].concat(this.state["collaborators"][index]["categoriesEmergencySelected"]);
				for (let ind = 0; ind < cate.length; ind++) { categories.push(cate[ind]["value"]); }
				this.state["collaborators"][index]["categoriesSelected"] = categories;
			} informacion["collaborators"] = this.state["collaborators"];
		}
		this.props["navigation"].navigate("RegistroCompletado", { type: "emp", informacion })
	}
	addCol = (colaborador) => {
		this.props["navigation"].setParams({ colaborador: {} });
		this.setState(prevState => ({ collaborators: prevState["collaborators"].concat(colaborador) }));
	}
	modCol = (id, colaborador) => { let collaborators = [...this.state["collaborators"]]; collaborators[id] = colaborador; this.setState({ collaborators }); }
	getColaborador = (idMod, collaborator) => {
		this.props["navigation"].navigate("Colaborador", { collaborator, ruta: "RegistroEmpresa4", idMod, categories: this.props["navigation"].getParam("informacion").categoriesSelected, categoriesEmergency: this.props["navigation"].getParam("informacion").categoriesEmergencySelected })
	}
	eliminar = (pos) => { let collaborators = [...this.state["collaborators"]]; collaborators.splice(pos, 1); this.setState({ collaborators }); }
	render() {
		return (
			<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<NavigationEvents onDidFocus={payload => {
					if (payload["state"]["params"] && payload["state"]["params"].colaborador && Object.keys(payload["state"].params["colaborador"]).length > 0) {
						if (payload["state"]["params"].idMod === -1) this.addCol(payload["state"].params.colaborador)
						else this.modCol(payload["state"].params.idMod, payload["state"].params.colaborador)
					}
				}}
				/>
				<View style={{ backgroundColor: "silver" }}>
					<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", marginVertical: 10 }}>Paso 4 de 5</Text>
				</View>
				<Text style={[textos.titulos, textos.blue, textos.mbott]}>Registro de colaboradores</Text>
				<Text style={{ marginHorizontal: 20, textAlign: "center", fontSize: 16 }}>Puedes registrar la cantidad de expertos que quieras</Text>
				<View style={{ display: (this.state["collaborators"].length) ? "none" : "flex" }}><Copy texto="Recuerda que para presentar ofertas debes tener un colaborador registrado" /></View>
				<Text style={{ textAlign: "center", marginVertical: 10, fontFamily: "Raleway-Bold", color: "#36425C", fontSize: 15 }}>{(this.state["collaborators"].length) ? "Colaboradores" : ""}</Text>
				<ScrollView style={{ flex: 1 }}>
					{
						this.state["collaborators"].map((item, i) => (
							<ListItem
								key={i} bottomDivider topDivider
								containerStyle={{ padding: 15 }}
								leftAvatar={<Image source={(item.photo && item.photo !== "") ? { uri: item.photo.uri } : require("../../../../assets/icon.png")} style={{ width: 50, height: 50 }} />}
								title={<Text style={{ fontFamily: "Raleway-Bold", marginHorizontal: 20 }}>{item.name}</Text>}
								subtitle={
									<View style={{ flexDirection: "row", flex: 1, marginTop: 5 }}>
										<View style={{ flex: 0.8 }} >
											<Button buttonStyle={{ borderColor: "#47AAC9", borderWidth: 0.5, backgroundColor: "#F2FCFD", paddingVertical: 3, paddingHorizontal: 15 }} title="Modificar" titleStyle={{ fontFamily: "Raleway-Bold", fontSize: 12, color: "#47AAC9" }}
												containerStyle={{ marginHorizontal: 10, alignItems: "flex-start" }}
												onPress={() => this.getColaborador(i, item)} />
										</View>
										<TouchableOpacity style={{ flex: 0.2 }} onPress={() => this.eliminar(i)}>
											<Icon name="delete" size={20} color="#AE3E3B" style={{ alignItems: "flex-end" }} />
										</TouchableOpacity>
									</View>
								}
							/>
						))
					}
				</ScrollView>
				<Button title="AGREGAR COLABORADOR" buttonStyle={[buttons.primary, buttons.mtop]}
					titleStyle={buttons.PrimaryText}
					onPress={() => this.addColaborador()}
				/>
				<Button title="CONTINUAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
					titleStyle={{ fontFamily: "Raleway-Bold" }}
					containerStyle={{ marginHorizontal: 25, marginBottom: 20, display: (this.state["collaborators"].length) ? "flex" : "none" }}
					onPress={() => this.continuar()}
				/>
				<Text style={{ textAlign: "center", marginBottom: 20, textDecorationLine: 'underline', color: "#3D99B9", fontFamily: "Raleway-Bold", fontSize: 16 }}
					onPress={() => this.omitir()}>Saltar este paso</Text>
			</View>
		)
	}
}
