function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i))  + ' ' + sizes[i];
}
const element = (tag, classes = [], content) => {
    const node = document.createElement(tag);
    if(classes.length){
        node.classList.add(...classes);
    }
    if(content){
        node.textContent = content;
    }

    return node 
}

const noop = function(){}

export function upload(selector, options ={}){
    let files = [];
    const onUpload = options.onUpload ?? noop
    const input = document.querySelector(selector);
    const open = element('button', ['btn'], 'open');
    const upload = element('button', ['btn', 'primary'], 'upload');
    const preview = element('div', ['preview']);


    if(options.multi){
        input.setAttribute('multiple', true)
    }
    if(options.accept && Array.isArray(options.accept)){
        input.setAttribute('accept', options.accept.join(','))
    }

    
    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upload);
    input.insertAdjacentElement('afterend', open);
    const triggerInput = () => input.click();
    open.addEventListener('click', triggerInput);
    upload.style.display = 'none'
    const changeHandler = event =>{
        if(!event.target.files.length){
            return 
        }

        upload.style.display = 'inline'

        files = Array.from(event.target.files) ;
        files.forEach(file => {
            if(!file.type.match('image')){
                return
            }

            const reader = new FileReader();

            reader.onload = ev =>{
                const source = ev.target.result;
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                        <div class ="preview-remove" data-name = "${file.name}"> &times; </div>
                        <img src = "${source}" alt ="${file.name}"></img>
                        <div class="preview-info"><span>${file.name}</span> ${bytesToSize(file.size)}</div>

                    </div>`);
            }

            reader.readAsDataURL(file)
        })
       
    }
    const removeHandler = event => {
        const {name} = event.target.dataset

        if(!name){
            return 
        }

        files = files.filter(file => file.name != name)

        if(!files.length){
            upload.style.display = 'none    '
        }

        const block = preview.querySelector(`[data-name = "${name}"]`).closest('.preview-image')
        block.classList.add('removing');
        setTimeout(()=>block.remove(), 300)

    }

    const clearPreview = element => {
        element.style.bottom = '4px'

        element.innerHTML = '<div class="preview-info-progress">  </div>'
    }

    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)
        onUpload(files)
    }

    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    upload.addEventListener('click', uploadHandler)
}   

