/**
 * XadillaX created at 2015-08-06 16:41:12 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var React = require("react-native");
var SearchResults = require("./SearchResults");
var {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicatorIOS,
    Image,
    Component
} = React;

var styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: "center",
        color: "#656565"
    },
    container: {
        padding: 30,
        marginTop: 65,
        alignItems: "center"
    },
    flowRight: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "stretch"
    },
    buttonText: {
        fontSize: 18,
        color: "white",
        alignSelf: "center"
    },
    button: {
        height: 36,
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#48bbec",
        borderColor: "#48bbec",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: "stretch",
        justifyContent: "center"
    },
    searchInpt: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flex: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: "#48bbec",
        borderRadius: 8,
        color: "#48bbec"
    },
    image: {
        width: 217,
        height: 138
    }
});

class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: "london",
            isLoading: false,
            message: ""
        };
    }

    onSearchTextChanged(event) {
        console.log("onSearchTextChanged");
        this.setState({ searchString: event.nativeEvent.text });
        console.log(this.state.searchString);
    }

    urlForQueryAndPage(key, value, pageNumber) {
        var data = {
            contry: "uk",
            pretty: "1",
            encoding: "json",
            action: "search_listings",
            page: pageNumber
        };
        data["listing_type"] = "buy";
        data[key] = value;

        var querystring = Object.keys(data)
            .map(function(key) {
                return key + "=" + encodeURIComponent(data[key]);
            })
            .join("&");
        return "http://api.nestoria.co.uk/api?" + querystring;
    }

    _handleResponse(response) {
        this.setState({ isLoading: false, message: "" });
        if(response["application_response_code"].substr(0, 1) === "1") {
            this.props.navigator.push({
                title: "Results",
                component: SearchResults,
                passProps: { listings: response.listings }
            });
        } else {
            this.setState({
                message: "Location not recognized; please try again."
            });
        }
    }

    _executeQuery(query) {
        console.log(query);
        this.setState({ isLoading: true });

        fetch(query)
            .then(response => response.json())
            .then(json => this._handleResponse(json.response))
            .catch(error => 
                this.setState({
                    isLoading: false,
                    message: "Something bad happened " + error
                })
            );
    }

    onSearchPressed() {
        var query = this.urlForQueryAndPage("place_name", this.state.searchString, 1);
        this._executeQuery(query);
    }

    onLocationPressed() {
        var self = this;
        navigator.geolocation.getCurrentPosition(
            function(location) {
                var search = location.coords.latitude + "," + location.coords.longitude;
                self.setState({ searchString: search });
                var query = self.urlForQueryAndPage("centre_point", search, 1);
                self._executeQuery(query);
            },
            function(err) {
                self.setState({
                    message: "There was a problem with obtaining your location: " + err.message
                });
            }
        );
    }

    render() {
        var spinner = this.state.isLoading ? 
            (<ActivityIndicatorIOS
                hidden="true"
                size="large" />) :
            (<View />);

        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Search for houses to buy!
                </Text>
                <Text style={styles.description}>
                    Search by place-name, postcode or search newr your location.
                </Text>

                <View style={styles.flowRight}>
                    <TextInput
                        style={styles.searchInpt}
                        value={this.state.searchString}
                        onChange={this.onSearchTextChanged.bind(this)}
                        placeholder="Search via name or postcode" />
                    <TouchableHighlight 
                        style={styles.button}
                        onPress={this.onSearchPressed.bind(this)}
                        underlayColor="#99d9f4">
                        <Text style={styles.buttonText}>Go</Text>
                    </TouchableHighlight>
                </View>

                <TouchableHighlight
                    style={styles.button}
                    onPress={this.onLocationPressed.bind(this)}
                    underlayColor="#99d9f4">
                    <Text style={styles.buttonText}>Location</Text>
                </TouchableHighlight>

                <Image source={require("image!house")} style={styles.image} />

                {spinner}

                <Text style={styles.description}>{this.state.message}</Text>
            </View>
        );
    }
};

module.exports = SearchPage;
