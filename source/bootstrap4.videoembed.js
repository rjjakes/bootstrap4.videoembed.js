
(function (window, document) {

    // Add function to document so it can be called with: document.videoEmbed()
    document.constructor.prototype.videoEmbed = function (selector) {
        const dqs = document.querySelectorAll.bind(document)

        // Separate scope for each iteration.
        dqs(selector).forEach(function (item, index) {

            // Get autoplay setting.
            let autoplay = 'false'
            if (item.getAttribute('data-autoplay')) {
                autoplay = item.getAttribute('data-autoplay')
            }

            // Carry on.
            let videoLink = item.getAttribute('href')
            let cleanVideoID
            let videoEmbedLink
            let previewImageUrl

            if (videoLink.match(/(youtube.com)/)) {
                cleanVideoID = videoLink.split('v=')[1].replace(/(&)+(.*)/, '')
            }
            else if (videoLink.match(/(youtu.be)/) || videoLink.match(/(vimeo.com\/)+[0-9]/)) {
                cleanVideoID = videoLink.split('/')[3].replace(/(&)+(.*)/, '')
            }
            else if (videoLink.match(/(vimeo.com\/)+[a-zA-Z]/)) {
                cleanVideoID = videoLink.split('/')[5].replace(/(&)+(.*)/, '')
            }

            if (videoLink.includes('youtu.be') || videoLink.includes('youtube.com')) {
                videoEmbedLink = `https://www.youtube.com/embed/${cleanVideoID}?autoplay=${autoplay.autoplay}`
                previewImageUrl = `https://img.youtube.com/vi/${cleanVideoID}/hqdefault.jpg`

                // Get and insert the thumbnail.
                item.innerHTML = `<img class="embedded-video-thumbnail" src="${previewImageUrl}" alt="Youtube video.">`
            }
            else if (videoLink.includes('vimeo.com')) {
                videoEmbedLink = `https://player.vimeo.com/video/${cleanVideoID}?autoplay=${autoplay.autoplay}`
                let saveThis = item    // save a reference to this

                // For vimeo, we have to call the API to get the image URL
                fetch(`http://vimeo.com/api/v2/video/${cleanVideoID}.json`)
                .then(response => {
                    if (response.ok) {
                        // Vimeo returns a JSON response.
                        return response.json()
                    }
                })
                .then(responseJson => {
                    // Decode the response to get the preview image URL.
                    try {
                        let responseItem = responseJson.pop()
                        saveThis.innerHTML = `<img class="embedded-video-thumbnail" src="${responseItem['thumbnail_large']}" alt="${responseItem['description']}">`
                    } catch (e) {
                        console.log(`Error: Unable to fetch thumbnail from Vimeo.`)
                    }
                })
                .catch(error => {
                    console.log(`Error: ${error.message}`)
                })

            }

            // Add bootstrap 4 modal.
            item.setAttribute('data-toggle', 'modal')
            item.setAttribute('data-target', '#videomodal')

            // Click handler.
            item.addEventListener('click', (e) => {

                let widthType = 'innerWidth',
                    width

                if (!('innerWidth' in window )) {
                    widthType = 'clientWidth'
                    window = document.documentElement || document.body
                }
                width = window[widthType]

                // Larger devices open the modal.
                if (width > 767) {
                    e.preventDefault()
                    let appendBody = `
                    <div class="modal fade" tabindex="-1" id="videomodal" role="dialog" aria-labelledby="myModalLabel"> 
                        <div class="modal-dialog" role="document"> 
                            <div class="modal-content"> 
                                <div class="modal-header"> 
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>  
                                </div> 
                                <div class="modal-body"> 
                                    <div class="VideoEmbed-Wrap VideoEmbed-animation">
                                        <div class="VideoEmbed-Content">
                                            <span class="VideoEmbed-Close"></span>
                                            <iframe src="${videoEmbedLink}" allowfullscreen></iframe>
                                        </div>
                                    </div> 
                                </div> 
                            </div> 
                            <div class="modal-footer"> 
                            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button> 
                        </div> 
                    </div>
                    `

                    // Add the modal template to the body.
                    let appendedItem = document.createElement('div')
                    appendedItem.setAttribute('id', 'videomodalWrap')
                    appendedItem.innerHTML = appendBody
                    document.body.appendChild(appendedItem)

                    $('#videomodal').on('hidden.bs.modal', () => {
                        $('#videomodalWrap').remove()
                    })

                } else {
                    // Mobile and small tablet just open the video.
                    window.location.href = videoLink
                }
            })
        })
    }

}(window, document));

