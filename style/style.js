import { StyleSheet } from 'react-native';

const general = StyleSheet.create({
	container: {
		marginTop: 150,
		backgroundColor: '#ededed',
		flexWrap: 'wrap'
	}
	, espacio1: {
		marginTop: 50,
	}
})

const buttons = StyleSheet.create({
	primary: {
		backgroundColor: "#43AECC",
		borderRadius: 7,
		marginBottom: 15,
		marginHorizontal: 20,
		marginTop: 15,
		height: 50,
	}
	, secondary: {
		borderColor: "#2CA4BF",
		borderRadius: 7,
		marginBottom: 15,
		marginHorizontal: 20,
		marginTop: 15,
		height: 50,
	}
	, PrimaryText: {
		fontFamily: "Raleway-Bold",
		fontSize: 16
	}
	, SecondaryText: {
		fontFamily: "Raleway-Bold",
		fontSize: 16,
		color: "#2CA4BF"
	}
	, mtop: {
		marginTop: 20,
	}

})

const textos = StyleSheet.create({
	titulos: {
		fontSize: 25,
		fontFamily: "Raleway-Bold",
		textAlign: "center",
		color: "#ffffff",
		marginTop: 15,
		marginHorizontal: 25
	}
	, blue: {
		color: "#283B64"
	}
	, mbott: {
		marginBottom: 15,
	}
	, black: {
		color: "black"
	}
	, bold: {
		fontFamily: "Raleway-Bold",
		marginBottom: 10,
	}
	, textcopy: {
		fontSize: 16,
		textAlign: "center",
		color: "#fff",
		marginTop: 15,
		marginBottom: 35,
		marginHorizontal: 35
	}
	, textcopydos: {
		fontSize: 16,
		textAlign: "center",
		color: "black",
		marginTop: 15,
		marginBottom: 15,
		marginHorizontal: 35
	}
})

const inputs = StyleSheet.create({
	text: {
		fontSize: 16,
		fontWeight: "normal",
		color: "#FFFFFF",
		marginHorizontal: 20,
		marginBottom: 5,
		marginTop: 5,
	}
	, textInt: {
		marginHorizontal: 10,
		fontSize: 14,
		color: "#BFBFBF",
		fontFamily: "Raleway-Bold",

	}
	, container: {
		marginHorizontal: 10,
		backgroundColor: "#FFFFFF",
		borderRadius: 7,
		marginBottom: 15,
	}
	, formularios: {
		backgroundColor: "#FFFFFF",
		marginHorizontal: 20,
		borderColor: "#BFBFBF",
		borderWidth: 0.5,
		borderRadius: 5,
		paddingTop: 8,
		borderWidth: 1,
		marginTop: 20,
		paddingBottom: 0
	}

})


export { general, buttons, textos, inputs };

