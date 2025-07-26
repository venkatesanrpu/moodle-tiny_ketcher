// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Ketcher iframe embed for Moodle Tiny plugin.
 *
 * @module      tiny_ketcher/embed
 * @copyright   2024 Venkatesan Rangarajan <venkatesanrpu@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import { get_string as getString } from 'core/str';
import Templates from 'core/templates';
import Modal from 'core/modal';
import Config from 'core/config';
import { exception as displayException } from 'core/notification';

export const ketcherEmbed = class {
    editor = null;
    constructor(editor) {
        this.editor = editor;
    }
    init = async () => {
        try {
            const modal = await Modal.create({
                title: await getString('buttonNameTitle', 'tiny_ketcher'),
                show: true,
                removeOnClose: true,
            });

            const { html, js } = await Templates.renderForPromise('tiny_ketcher/ketcher_template', {});
            Templates.appendNodeContents(modal.getBody(), html, js);

            // Optional: Set modal body height for better fit
            const body = modal.getBody ? modal.getBody() : null;
            if (body) {
                body.style.height = '500px';
                body.style.overflow = 'hidden';
            }

            // Save button event to forward action to iframe
            const saveBtn = body ? body.querySelector('#actionButton') : null;
            const iframe = body ? body.querySelector('#ketcheriframe') : null;
            if (saveBtn && iframe) {
                saveBtn.addEventListener('click', function () {
                    // Send a postMessage to the iframe to trigger save
                    iframe.contentWindow.postMessage({ type: 'saveStructure' }, '*');
                });
            }

            // Listen for result from iframe (SVG, etc)
            window.addEventListener('message', function (event) {
                if (event.data && event.data.type === 'ketcherStructure') {
                    // Insert SVG or image into TinyMCE
                    if (window.parent.tinyMCE && window.parent.tinyMCE.activeEditor) {
                        window.parent.tinyMCE.activeEditor.execCommand('mceInsertContent', 0, event.data.content);
                    }
                    // Close the modal
                    modal.close();
                }
            }, { once: true });
        } catch (error) {
            displayException(error);
        }
    };
};