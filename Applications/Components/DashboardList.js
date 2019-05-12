import React, { Component } from 'react'
import { Text, View, FlatList, Dimensions, Linking } from 'react-native'
import Toast, { DURATION } from 'react-native-easy-toast'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'

const { width, height } = Dimensions.get('window')

export default class DashboardList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            articles: []
        }
    }

    async componentDidMount() {
        try {
            let config = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            const URL = 'https://newsapi.org/v2/top-headlines?country=co&category=technology&apiKey=0a4c95a16be648e8be07e265bbc31af2'
            const response = await fetch(URL, config)
            const responseJson = await response.json()
            this.setState({
                articles: responseJson.articles
            }, () => {
                console.log(this.state.articles)
            })
        } catch (error) {
            console.log(error)
        }
    }


    renderItem = ({ item }) => {
        return (
            <Card>
                <CardImage
                    source={{ uri: `${item.urlToImage}` }}
                    title={`Autor: ${item.author}`}
                    resizeMode='cover'
                />
                <CardTitle
                    title={item.title}
                    subtitle={item.publishedAt}
                />
                <CardContent text={item.description} />
                <CardAction seperator={true} inColumn={false}>
                    <CardButton
                        onPress={() => { Linking.openURL(item.url) }}
                        title='Leer más..'
                        color='#C19AB7'
                    />
                </CardAction>
            </Card>
        )
    }

    render() {
        return (
            <View style={{ width, height, paddingLeft: 20 }}>
                <FlatList
                    data={this.props.articles}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing='true'
                />
                <Toast
                    ref="toast"
                    style={{ backgroundColor: 'transparent' }}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: 'black' }}
                />
            </View>
        )
    }
}