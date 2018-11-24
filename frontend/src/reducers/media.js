const mediaInitialState = {
    isLoading: true,
    currentMedia: {},
    mediaList: []
}

const mediaList = (state = mediaInitialState, action) => {
    switch (action.type) {
        case 'INIT_MEDIA_LIST':
            return { ...state, mediaList: action.mediaList, currentMedia: action.mediaList[0], isLoading: false }

        // Update the current media and the corresponding item
        case 'SET_CURRENT_MEDIA':
            return { ...state, currentMedia: action.media}

        default:
            return state
    }
}

export default mediaList