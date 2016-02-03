/**
 * Created by Gennadiy on 04.12.2015.
 */
'use strict';
var tree;
tree = {
    items: {
        span: {
            dragaElemets: document.getElementsByTagName('span'),
            resetter: function () {
                for (var i = 0; i < this.dragaElemets.length; i++) {
                    this.dragaElemets[i].parentNode.setAttribute('draggable', 'false');
                    this.dragaElemets[i].addEventListener('dblclick', tree.dblclick.getTarget, false);
                    this.dragaElemets[i].parentNode.addEventListener('mouseenter', tree.items.mouse.enter.doIt, false);
                    this.dragaElemets[i].parentNode.addEventListener('mouseleave', tree.items.mouse.leave.doIt, false);
                    if (this.dragaElemets[i].parentNode.parentNode.parentNode.tagName === 'BODY') {
                        this.dragaElemets[i].parentNode.addEventListener('dragstart', tree.items.drag.start, false);
                        this.dragaElemets[i].parentNode.addEventListener('dragenter', tree.items.drag.over, false);//For IE 9<
                        this.dragaElemets[i].parentNode.addEventListener('dragover', tree.items.drag.over, false);
                        this.dragaElemets[i].parentNode.addEventListener('drop', tree.items.drag.drop, false);
                        this.dragaElemets[i].parentNode.addEventListener('contextmenu', tree.contMenu.insert, false);
                    }
                }
            }
        },
        clot: {
            button: document.getElementsByTagName('div'),
            doIt: function () {
                for (var i = 0; i < this.button.length; i++) {
                    this.button[i].addEventListener('click', tree.items.doIt, false);
                }
            }
        },
        doIt: function (event) {
            event.stopPropagation();
            if (event.target.textContent === '+') {
                event.target.parentNode.setAttribute('class', '');
                event.target.textContent = '-';
                event.target.setAttribute('class', 'show');
            }
            else {
                event.target.textContent = '+';
                event.target.parentNode.setAttribute('class', 'clot');
                event.target.setAttribute('class', 'hide');
            }
        },
        mouse: {
            enter: {
                drag: 'true',
                doIt: function (event) {
                    event.target.setAttribute('draggable', 'true');
                }
            },
            leave: {
                drag: 'false',
                doIt: function (event) {
                    event.target.setAttribute('draggable', 'false');
                }
            }
        },
        drag: {
            start: function (event) {
                // store a ref. on the dragged elem
                tree.items.drag.this_insert_old = event.target;
                tree.items.drag.this_insert = new Object(event.target.cloneNode(true));
                event.dataTransfer.setData('text', 'data');
                event.dataTransfer.effectAllowed = "move";
            },
            over: function (event) {
                // prevent default to allow drop
                event.preventDefault();
            },
            clot: '',
            drop: function (event) {
                // prevent default action (open as link for some elements)
                event.preventDefault();
                tree.items.drag.this_insert_before = event.target.parentNode;
                tree.items.drag.clot = tree.items.drag.this_insert_before.parentNode.insertBefore(tree.items.drag.this_insert, tree.items.drag.this_insert_before);
                tree.items.drag.this_insert_old.parentNode.removeChild(tree.items.drag.this_insert_old);
                tree.items.drag.clot.children[0].addEventListener('click', tree.items.doIt, false);
                tree.items.span.dragaElemets = tree.items.drag.clot.getElementsByTagName('span');
                tree.items.span.resetter();
            }
        }
    },
    load: function () {
        tree.items.span.resetter.call(tree.items.span);
        tree.items.clot.doIt.call(tree.items.clot);
        tree.disactive = document.getElementsByTagName('h1')[0];
    },
    contMenu: {
        box: {
            tags: 'ul',
            el: {},
            ID: 'contextmenu',
            CLASS: 'contextmenu',
            make: function () {
                this.el = document.body.appendChild(document.createElement(this.tags));
                this.el.setAttribute('id', this.ID);
                this.el.setAttribute('class', this.CLASS);
            }
        },
        Item: {
            el: [],
            tags: 'li',
            parents: '',
            childs: '',
            CLASS: 'block',
            ID: 'pre',
            evListName: '',
            make: function () {
                this.childs = document.createElement(this.tags);
                this.parents.appendChild(this.childs);
                this.childs.setAttribute('id', this.ID);
                this.childs.setAttribute('class', this.CLASS);
                this.childs.textContent = this.ID.toUpperCase();
                this.childs.addEventListener('click', this.evListName, false);
                this.el[this.ID] = this.childs;
            }
        },
        insert: function (event) {
            event.preventDefault();
            tree.items.span = event.target;
            tree.items.span.setAttribute('class', 'active');
            if (document.getElementById('contextmenu') === null) {
                tree.contMenu.box.make.call(tree.contMenu.box);

                tree.contMenu.Item.parents = tree.contMenu.box.el;
                tree.contMenu.Item.ID = 'list';
                tree.contMenu.Item.evListName = tree.contMenu.list.add;
                tree.contMenu.Item.make.call(tree.contMenu.Item);

                tree.contMenu.Item.ID = 'close';
                tree.contMenu.Item.evListName = tree.contMenu.closeContMenu;
                tree.contMenu.Item.make.call(tree.contMenu.Item);
                tree.contMenu.Item.childs.textContent = 'X';

                tree.contMenu.Item.ID = 'clone';
                tree.contMenu.Item.evListName = tree.contMenu.clone;
                tree.contMenu.Item.make.call(tree.contMenu.Item);

                tree.contMenu.Item.ID = 'delete';
                tree.contMenu.Item.evListName = tree.contMenu.delete;
                tree.contMenu.Item.make.call(tree.contMenu.Item);

                tree.contMenu.Item.ID = 'save';
                tree.contMenu.Item.evListName = tree.contMenu.save;
                tree.contMenu.Item.make.call(tree.contMenu.Item);
            }
            else return true;
        },
        closeContMenu: function (event) {
            if (tree.items.span) tree.items.span.removeAttribute('class');
            document.body.removeChild(event.target.parentNode);
        },
        closeHistory: function (event) {
            if (tree.items.span) tree.items.span.removeAttribute('class');
            document.body.removeChild(event.target.parentNode.parentNode);
            tree.contMenu.box.el.removeAttribute('style');
            console.log(tree.contMenu.box.el);
        },
        delete: function () {
            tree.items.span.parentNode.parentNode.removeChild(tree.items.span.parentNode);
        },
        clone: function () {
            tree.items.span.removeAttribute('class');
            tree.items.span.parentNode.parentNode.insertBefore(
                tree.items.span.parentNode.cloneNode(true),
                tree.items.span.parentNode);
        },
        removeItem: function () {
            tree.AJAX.parameters = 'removeitem=' + this.previousElementSibling.previousElementSibling.textContent;
            tree.AJAX.content = document.getElementsByClassName('node')[0];
            tree.AJAX.add.call(tree.AJAX);
            this.parentNode.parentNode.removeChild(this.parentNode);
        },
        addItem: function () {
            //tree.contMenu.save();
            console.log(this);
            tree.contMenu.list.update();
            //console.log(this.parentNode.previousSibling);
            //this.parentNode.parentNode.insertBefore(this.parentNode.cloneNode(true), this.parentNode);
            //this.parentNode.previousSibling.children[1].addEventListener('click', tree.contMenu.moveHistory.make, false);
            //this.parentNode.previousSibling.children[1].textContent = 'Just added';
            //this.parentNode.previousSibling.children[2].addEventListener('click', tree.contMenu.removeItem, false);
            ////this.parentNode.previousSibling.children[3].addEventListener('click', tree.contMenu.addItem, false);
            //this.parentNode.previousSibling.children[3].addEventListener('click', tree.contMenu.list.update, false);
        },
        list: {
            add: function () {
                tree.AJAX.parameters = 'history=';
                tree.AJAX.store = document.body.appendChild(document.createElement('ul'));
                tree.AJAX.store.setAttribute('class', 'listcontent');
                tree.AJAX.opcity = document.body.appendChild(document.createElement('div'));
                tree.AJAX.opcity.setAttribute('class', 'opacity');
                tree.AJAX.opcity.innerHTML = '<span class="plus">-</span><span class="minus">+</span><span class="close">X</span>';
                tree.AJAX.content = tree.AJAX.store;
                tree.AJAX.add.call(tree.AJAX);
                tree.contMenu.box.el.setAttribute('style', 'visibility:hidden;');
            },
            update: function () {
                tree.AJAX.parameters = 'update=';
                //tree.AJAX.store = tree.AJAX.store || document.body.appendChild(document.createElement('div'));
                tree.AJAX.store.setAttribute('class', 'listcontent');
                tree.AJAX.content = tree.AJAX.store;
                tree.AJAX.store = tree.AJAX.store || document.body.appendChild(document.createElement('ol'));
                tree.AJAX.store.setAttribute('class', 'listcontent');
                tree.AJAX.store.setAttribute('id', 'history');
                tree.AJAX.store.setAttribute('start', '0');
                tree.AJAX.update.call(tree.AJAX);
                tree.contMenu.box.el.setAttribute('style', 'visibility:hidden;');
            }
        },
        historyPrep: function () {
            for (var i = 1; i < this.length - 1; i++) {
                //this[i].children[1].addEventListener('click', tree.contMenu.moveHistory.make, false);
                //    this[i].children[2].addEventListener('click', tree.contMenu.removeItem, false);
                //    this[i].children[3].addEventListener('click', tree.contMenu.addItem, false);
            }
            //this[0].addEventListener('click', tree.contMenu.closeHistory, false);
            //this[0].ev = {};
            //this[0].ev.list = tree.contMenu.list.add;
            //this[0].ev.elem = tree.contMenu.Item.el.list;
            //this[this.length - 1].children[0].addEventListener('click', tree.contMenu.Opacity.setting, false);
            //this[this.length - 1].children[1].addEventListener('click', tree.contMenu.Opacity.setting, false);
        },
        Opacity: {
            op: 0,
            setting: function () {
                this.textContent == '+' ? this.op < 9 ? this.op++ : this.op = 1 : this.op > 0 ? this.op-- : this.op = 9;
                this.parentNode.parentNode.parentNode.setAttribute('style', 'opacity:0.' + this.op + ';');
            }
        },
        moveHistory: {
            ID: '',
            make: function () {
                tree.AJAX.parameters = 'id=' + this.previousElementSibling.textContent;
                tree.AJAX.content = document.getElementsByClassName('node')[0];
                tree.AJAX.add.call(tree.AJAX);
            }
        },
        save: function () {
            tree.items.span.removeAttribute('class');
            tree.AJAX.parameters = 'insert=';
            tree.AJAX.content = document.getElementsByClassName('node')[0].innerHTML;
            tree.AJAX.moveHistory.call(tree.AJAX);
            if (tree.items.span) tree.items.span.removeAttribute('class');
            document.body.removeChild(tree.contMenu.box.el);
        }
    },
    AJAX: {
        url: 'CrudClass.php',
        parameters: 'history=',
        content: '',
        add: function () {
            tree.AJAX.params = this.parameters + this.content;
            tree.AJAX.http = new XMLHttpRequest();
            tree.AJAX.http.open('POST', this.url, true);
            tree.AJAX.http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            tree.AJAX.http.onreadystatechange = function () {
                if (tree.AJAX.http.readyState < 4 && tree.AJAX.http.status == 200) {
                    tree.disactive.setAttribute('id', 'load');
                }
                if (tree.AJAX.http.readyState == 4 && tree.AJAX.http.status == 200) {
                    tree.AJAX.content.innerHTML = tree.AJAX.http.responseText;
                    tree.contMenu.Item.el.list.removeEventListener('click', tree.contMenu.historyPrep, false);
                    tree.contMenu.historyPrep.call(tree.AJAX.store.children[0].children);
                    tree.disactive.setAttribute('id', 'loaded');
                }
            };
            tree.AJAX.http.send(tree.AJAX.params);
        },
        update: function () {
            tree.AJAX.params = this.parameters + this.content;
            tree.AJAX.http = new XMLHttpRequest();
            tree.AJAX.http.open('POST', this.url, true);
            tree.AJAX.http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            tree.AJAX.http.onreadystatechange = function () {
                if (tree.AJAX.http.readyState < 4 && tree.AJAX.http.status == 200) {
                    tree.disactive.setAttribute('id', 'load');
                }
                if (tree.AJAX.http.readyState == 4 && tree.AJAX.http.status == 200) {
                    tree.AJAX.content.innerHTML = tree.AJAX.http.responseText;
                    tree.disactive.setAttribute('id', 'loaded');
                }
            };
            tree.AJAX.http.send(tree.AJAX.params);
        },
        moveHistory: function () {
            tree.AJAX.params = this.parameters + this.content;
            tree.AJAX.http = new XMLHttpRequest();
            tree.AJAX.http.open('POST', this.url, true);
            tree.AJAX.http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            tree.AJAX.http.onreadystatechange = function () {
                if (tree.AJAX.http.readyState < 4 && tree.AJAX.http.status == 200) {
                    tree.disactive.setAttribute('id', 'load');
                }
                if (tree.AJAX.http.readyState == 4 && tree.AJAX.http.status == 200) {
                    tree.AJAX.content = tree.AJAX.http.responseText;
                    tree.disactive.setAttribute('id', 'loaded');
                }
            };
            tree.AJAX.http.send(tree.AJAX.params);
        }
    },
    dblclick: {
        Span: '',
        textarea: '',
        getTarget: function (event) {
            event.stopPropagation();
            tree.dblclick.Span = event.target;
            tree.dblclick.edit.call(tree.dblclick);
        },
        edit: function () {
            this.textarea = document.createElement('textarea');
            this.textarea.addEventListener('mouseleave', tree.dblclick.caller, false);
            this.textarea.setAttribute('class', 'editable');
            this.textarea.textContent = this.Span.textContent;
            this.Span.parentNode.insertBefore(this.textarea, this.Span);
            this.textarea.parentNode.removeEventListener('contextmenu', tree.contMenu.insert, false);
            this.Span.parentNode.removeChild(this.Span);
        },
        caller: function () {
            tree.dblclick.notEdit.call(tree.dblclick);
        },
        notEdit: function () {
            this.Span = document.createElement('span');
            this.Span.textContent = this.textarea.value;
            this.textarea.parentNode.insertBefore(this.Span, this.textarea);
            this.textarea.parentNode.removeChild(this.textarea);
            this.Span.addEventListener('click', this.getTarget, false);
            this.Span.parentNode.addEventListener('contextmenu', tree.contMenu.insert, false);
        }
    }
};

if (window.addEventListener) window.addEventListener('load', tree.load, true);

else window.attachEvent('onload', tree.load);