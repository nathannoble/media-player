import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import * as config from '../config';


const styles = theme => ({
    card: {
        display: 'flex',
        width: 316
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '2 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    pauseIcon: {
        height: 38,
        width: 38,
    },
});

class MediaControl extends Component {

    constructor(props) {
        super(props);
        this.url = null;
        this.audio = null;
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.initMedia = this.initMedia.bind(this)
        this.playAudio = this.playAudio.bind(this);
        this.pauseAudio = this.pauseAudio.bind(this);
        this.playNext = this.playNext.bind(this);
        this.playPrevious = this.playPrevious.bind(this);
    }

    // Also send a socket message to register playing audio for this user
    playAudio() {
        this.audio.play()

        // Data to send to socket
        var data = Object.assign({}, this.props.media.currentMedia)
        data.userId = this.props.userId
        this.props.socket.emit('play', data)
    }

    // Also send a socket message to register paused audio for this user
    pauseAudio() {
        this.audio.pause()

        // Data to send to socket
        const data = {
            mediaId: this.props.media.currentMedia.id,
            userId: this.props.userId
        }
        this.props.socket.emit('pause', data)
    }


    initMedia() {
        let song = this.props.media.currentMedia

        // Make sure we have a player
        if (this.audio == null) {
            this.url = config.MEDIA_SERVICE + song.location;
            this.audio = new Audio(this.url);
        }

        // Perform action based on song state
        if (config.MEDIA_SERVICE + song.location === this.url) {
            if (song.isPlaying === true) {
                this.playAudio()
            } else {
                this.pauseAudio()
            }
        } else {
            let isDefaultSong = this.url == null
            this.url = config.MEDIA_SERVICE + song.location;
            if (this.audio) {
                this.pauseAudio()
                this.audio = null
            }

            this.audio = new Audio(this.url);

            if (!isDefaultSong) {
                this.playAudio()
            }
        }

    }

    play() {
        // Update media state
        let song = this.props.media.currentMedia
        song.isPlaying = true
        this.props.setCurrent(song)
    }

    pause() {
        // Update media state
        let song = this.props.media.currentMedia
        song.isPlaying = false
        this.props.setCurrent(song)
    }

    playNext() {
        let curr = this.props.media.currentMedia
        let mediaList = this.props.media.mediaList
        // Get the index of this current song
        let index = mediaList.findIndex(m => m.id === curr.id) + 1
        let song = mediaList[index]

        if (song) {
            song.isPlaying = true
            this.props.setCurrent(song)
        }else{
            song = mediaList[0]
            song.isPlaying = true
            this.props.setCurrent(song)
        }
    }


    playPrevious() {
        let curr = this.props.media.currentMedia
        let mediaList = this.props.media.mediaList
        // Get the index of this current song
        let index = mediaList.findIndex(m => m.id === curr.id) - 1
        let song = mediaList[index]

        if (song) {
            song.isPlaying = true
            this.props.setCurrent(song)
        }else{
            song = mediaList[mediaList.length-1]
            song.isPlaying = true
            this.props.setCurrent(song)
        }
    }

    render() {

        const { classes, theme, media } = this.props;
        const currentSong = media.currentMedia
        const isLoading = media.isLoading

        if (isLoading) {
            return (<div>Loading..</div>);
        } else {
            this.initMedia()
        }

        return (
            <Card className={classes.card}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                            {currentSong.title}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {currentSong.artistName}
                        </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                        <IconButton aria-label="Previous" onClick={this.playPrevious}>
                            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                        </IconButton>
                        {currentSong.isPlaying ?
                            <IconButton aria-label="Pause" onClick={this.pause}>
                                <PauseIcon className={classes.pauseIcon} />
                            </IconButton> :
                            <IconButton aria-label="Play" onClick={this.play}>
                                <PlayArrowIcon className={classes.playIcon} />
                            </IconButton>}
                        <IconButton aria-label="Next" onClick={this.playNext}>
                            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                        </IconButton>
                    </div>
                </div>
                <CardMedia
                    className={classes.cover}
                    image={"/images/" + currentSong.albumArt}
                    title={currentSong.album}
                />
            </Card>
        );
    }


}

MediaControl.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        media: state.media
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrent: media => dispatch({ type: 'SET_CURRENT_MEDIA', media: media }),
    };
};

export default withStyles(styles, { withTheme: true })(connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaControl))