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
        // width: 360
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
    }


    initMedia() {
        let song = this.props.media.currentMedia
        
        // Make sure we have a player
        if(this.audio == null){
            this.url = config.MEDIA_SERVICE + song.location;
            this.audio = new Audio(this.url);
        }

        // Perform action based on song state
        if (config.MEDIA_SERVICE + song.location === this.url) {
            if(song.isPlaying === true){
                this.audio.play()
            }else{
                this.audio.pause()
            }
        } else {
            let isDefaultSong = this.url == null
            this.url = config.MEDIA_SERVICE + song.location;
            if (this.audio) {
                this.audio.pause()
                this.audio = null
            }

            this.audio = new Audio(this.url);
            
            if(!isDefaultSong){
                this.audio.play()
            }
        }

    }

    play() {
        // Update media state
        let song = this.props.media.currentMedia
        song.isPlaying = true
        this.props.updateMedia(song)
    }

    pause() {
        // Update media state
        let song = this.props.media.currentMedia
        song.isPlaying = false
        this.props.updateMedia(song)
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
                        <IconButton aria-label="Previous">
                            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                        </IconButton>
                        {currentSong.isPlaying ?
                            <IconButton aria-label="Pause" onClick={this.pause}>
                                <PauseIcon className={classes.pauseIcon} />
                            </IconButton> :
                            <IconButton aria-label="Play" onClick={this.play}>
                                <PlayArrowIcon className={classes.playIcon} />
                            </IconButton>}


                        <IconButton aria-label="Next">
                            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                        </IconButton>
                    </div>
                </div>
                <CardMedia
                    className={classes.cover}
                    image={"/images/" + currentSong.albumArt}
                    title="Live from space album cover"
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
        updateMedia: media => dispatch({ type: 'SET_CURRENT_MEDIA', media: media }),
    };
};

export default withStyles(styles, { withTheme: true })(connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaControl))