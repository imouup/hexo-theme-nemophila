// SPDX-License-Identifier: GPL-3.0-or-later
class Linking extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const type = this.getAttribute('type');
        const title = this.getAttribute('title');
        let href = this.getAttribute('link');
        if (href && type && type === 'inside') {
            let temphref = href;
            if (href.startsWith('/') ) {
                temphref = href.replace('/','');  
            }
            href = window.origin + '/' + temphref;
        }

        const commonStyle = `
            :host {
                max-width: 100%;       
                vertical-align: middle;
            }
            a { text-decoration: none; color: inherit; }
            * { box-sizing: border-box; } 
        `;

        if (type) {
            if (type === 'inside') {
                this.shadowRoot.innerHTML = `
                    <style>
                        ${commonStyle}
                        .link-in {
                            display: inline-flex; 
                            height: 32px;
                            margin: 8px 4px;
                            width: fit-content;
                            font-family: 'Noto Serif SC', serif;
                            font-size: 16px;
                            color: #1c2029;
                            background-color: #FFFFFF;
                            border: 1px solid #cacdcf;
                            //box-shadow: 0px 1px 5px 2px rgba(205, 216, 232, 1.0);
                            font-weight: 600;
                            border-radius: 8px;
                            padding: 0 16px 2px 16px;
                            align-items: center;

                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;

                            //text-decoration: underline #9298a3;
                            transition: all 0.2s ease-in-out;
                           

                            &:hover {
                                background-color: #F0FAFF;
                                //color: #2F5284;
                            }
                        }
                    </style>
                    <a class="link-in" href="${href}">${title}</a>
        
                `;
            } else if (type === 'outside') {
                 this.shadowRoot.innerHTML = `
                    <style>
                        ${commonStyle}
                        .link-out {
                            display: block;
                            text-decoration: none;
                            height: 64px;
                            margin: 16px auto;
                            padding: 8px 12px;
                            

                            
                        }
                        .link-out-section {
                            display: flex;
                            flex-direction: column;
                            gap:0px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            width: 400px;
                            margin: 0 auto;
                            border: 1px solid #cacdcf;
                            padding: 10px 8px;
                            border-radius: 15px;
                            transition: all 0.2s;

                            &:hover {
                                h3 { color: #6C9AE4; }
                                p { color: #C7D0F5; }
                                border: 1px solid #C7D0F5;
                            }
                            

                            h3 {
                                font-family: 'Noto Serif SC', serif;
                                font-size: 16px;
                                color: #14171F;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                padding: 0 16px 0 24px;
                                margin: 4px 0 0 0;
                                line-height: 1.6;
                                transition: all 0.2s ;

                    

                            }
                            p {
                                font-family: 'Noto Serif SC', serif;
                                font-size: 14px;
                                color: #9298a3;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                padding: 0 16px 0 24px;
                                margin: 0 0 8px 0  ;
                                line-height: 1.4;
                                transition: all 0.2s ;
                            }
                        }
                    </style>
                    <a href="${href}" target="_blank" class="link-out">
                    <section class="link-out-section">
                        <h3>${title}</h3>
                        <p>${href}</p>
                    </section>
                    </a>
        
                `;
            }
        }


        

    }

}
customElements.define('link-ing', Linking);