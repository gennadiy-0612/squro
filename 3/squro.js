/**
 * Created by Gennadiy on 04.12.2015.
 */
'use strict';
var tree;
tree = {
    items: {
        span: {
            DragDrop: document.getElementsByTagName('span'),
            resetter: function () {
                for (var i = 0; i < this.DragDrop.length; i++) {
                    this.DragDrop[i].parentNode.setAttribute('draggable', 'false');
                    this.DragDrop[i].addEventListener('dblclick', tree.dblclick.getTarget, false);
                    this.DragDrop[i].parentNode.addEventListener('mouseenter', tree.items.mouse.enter.do_it, false);
                    this.DragDrop[i].parentNode.addEventListener('mouseleave', tree.items.mouse.leave.do_it, false);
                    if (this.DragDrop[i].parentNode.parentNode.parentNode.tagName === 'BODY') {
                        this.DragDrop[i].parentNode.addEventListener('dragstart', tree.items.drag.start, false);
                        this.DragDrop[i].parentNode.addEventListener('dragenter', tree.items.drag.over, false);//For IE 9<
                        this.DragDrop[i].parentNode.addEventListener('dragover', tree.items.drag.over, false);
                        this.DragDrop[i].parentNode.addEventListener('drop', tree.items.drag.drop, false);
                        this.DragDrop[i].parentNode.addEventListener('contextmenu', tree.contMenu.insert, false);
                    }
                }
            }
        },
        clot: {
            button: document.getElementsByTagName('div'),
            do_it: function () {
                for (var i = 0; i < this.button.length; i++) {
                    this.button[i].addEventListener('click', tree.items.do_it, false);
                }
            }
        },
        do_it: function (event) {
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
                do_it: function (event) {
                    event.target.setAttribute('draggable', 'true');
                }
            },
            leave: {
                drag: 'false',
                do_it: function (event) {
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
                tree.items.drag.clot.children[0].addEventListener('click', tree.items.do_it, false);
                tree.items.span.DragDrop = tree.items.drag.clot.getElementsByTagName('span');
                tree.items.span.resetter();
            }
        }
    },
    load: function () {
        tree.items.span.resetter.call(tree.items.span);
        tree.items.clot.do_it.call(tree.items.clot);
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
                tree.contMenu.Item.ID = 'pre';
                tree.contMenu.Item.evListName = tree.contMenu.addList;
                tree.contMenu.Item.make.call(tree.contMenu.Item);
                tree.contMenu.Item.childs.textContent = '<';
                tree.contMenu.Item.el.pre.display = 'none';

                tree.contMenu.Item.ID = 'list';
                tree.contMenu.Item.evListName = tree.contMenu.addList;
                tree.contMenu.Item.make.call(tree.contMenu.Item);
                tree.contMenu.Item.el.list.textContent = tree.contMenu.Item.el.list.textAfterDel = '=';
                tree.contMenu.Item.el.list.display = 'block';

                tree.contMenu.Item.ID = 'close';
                tree.contMenu.Item.evListName = tree.contMenu.close;
                tree.contMenu.Item.make.call(tree.contMenu.Item);
                tree.contMenu.Item.childs.textContent = 'X';
                tree.contMenu.Item.el.close.delInfo = {
                    papa: tree.contMenu.Item.el.close.parentNode.parentNode,
                    elem: tree.contMenu.Item.el.close.parentNode
                };

                tree.contMenu.Item.ID = 'next';
                tree.contMenu.Item.evListName = tree.contMenu.addList;
                tree.contMenu.Item.make.call(tree.contMenu.Item);
                tree.contMenu.Item.childs.textContent = '>';
                tree.contMenu.Item.el.next.display = 'none';

                tree.contMenu.Item.ID = 'clone';
                tree.contMenu.Item.evListName = tree.contMenu.clone;
                tree.contMenu.Item.make.call(tree.contMenu.Item);

                tree.contMenu.Item.ID = 'delete';
                tree.contMenu.Item.evListName = tree.contMenu.delete;
                tree.contMenu.Item.make.call(tree.contMenu.Item);

                tree.contMenu.Item.ID = 'edit';
                tree.contMenu.Item.evListName = tree.dblclick.getTarget;
                tree.contMenu.Item.make.call(tree.contMenu.Item);

                tree.contMenu.Item.ID = 'save';
                tree.contMenu.Item.evListName = tree.contMenu.save;
                tree.contMenu.Item.make.call(tree.contMenu.Item);
                tree.contMenu.Item.el.save.papaForDelete = tree.contMenu.Item.el.save.parentNode.parentNode;
                tree.contMenu.Item.el.save.elemForDelete = tree.contMenu.Item.el.save.parentNode;
            }
            else return;
        },
        navy: [],
        here: '',
        close: function (event) {
            console.log(event.target.parentNode.parentNode);
            event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
            if (tree.items.span) tree.items.span.removeAttribute('class');
        },
        show: function () {
            console.log(this);
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
            tree.AJAX.parametrs = 'removeitem=' + this.previousElementSibling.previousElementSibling.textContent;
            tree.AJAX.content = document.getElementsByClassName('node')[0];
            tree.AJAX.add.call(tree.AJAX);
            this.parentNode.parentNode.removeChild(this.parentNode);
        },
        addList: function (event) {
            tree.AJAX.parametrs = 'history=';
            tree.AJAX.store = document.body.appendChild(document.createElement('div'));
            tree.AJAX.styler = event.target.display;
            tree.AJAX.store.papaForDelete = tree.AJAX.store.parentNode;
            tree.AJAX.store.elemForDelete = tree.AJAX.store;
            tree.AJAX.store.setAttribute('class', 'listcontent');
            tree.AJAX.content = tree.AJAX.store;
            //tree.contMenu.Item.el.list.removeEventListener('click', tree.contMenu.addList, false);
            tree.AJAX.add.call(tree.AJAX);
            tree.AJAX.store.setAttribute('style', 'display:' + tree.AJAX.styler + ';');
            this.removeEventListener('click', tree.contMenu.addList, false);
            this.addEventListener('click', tree.contMenu.addList, false);
            console.log(this)
        },
        historyPrep: function () {
            for (var i = 1; i < this.length - 1; i++) {
                tree.contMenu.navy[i - 1] = this[i].children[0].textContent;
                tree.contMenu.moveHistory.ID = tree.contMenu.navy[i - 1];
                this[i].children[1].addEventListener('click', tree.contMenu.moveHistory.make, false);
                this[i].children[2].addEventListener('click', tree.contMenu.removeItem, false);
                this[i].children[3].addEventListener('click', tree.contMenu.save, false);
            }
            this[0].addEventListener('click', tree.contMenu.close, false);
            this[0].papaForDelete = this[0].parentNode.parentNode.parentNode;
            this[0].elemForDelete = this[0].parentNode.parentNode;
            this[0].ev = {};
            this[0].ev.list = tree.contMenu.addList;
            this[0].ev.elem = tree.contMenu.Item.el.list;
            //tree.contMenu.Item.el.list.parentNode.setAttribute('style', 'opacity:0;');
            this[this.length - 1].children[0].addEventListener('click', tree.contMenu.Opacity.setting, false);
            this[this.length - 1].children[1].addEventListener('click', tree.contMenu.Opacity.setting, false);
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
                tree.contMenu.here = this.previousElementSibling.textContent;
                tree.AJAX.parametrs = 'id=' + this.previousElementSibling.textContent;
                tree.AJAX.content = document.getElementsByClassName('node')[0];
                tree.AJAX.add.call(tree.AJAX);
            }
        },
        save: function () {
            tree.items.span.removeAttribute('class');
            tree.AJAX.parametrs = 'insert=';
            tree.AJAX.content = document.getElementsByClassName('node')[0].innerHTML;
            tree.AJAX.moveHistory.call(tree.AJAX);
            console.log(this.parentNode.parentNode.parentNode.parentNode);
        }
    },
    AJAX: {
        url: 'CrudClass.php',
        parametrs: 'history=',
        content: '',
        resp: '',
        add: function () {
            tree.AJAX.params = this.parametrs + this.content;
            tree.AJAX.http = new XMLHttpRequest();
            tree.AJAX.http.open('POST', this.url, true);
            tree.AJAX.http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            tree.AJAX.http.onreadystatechange = function () {
                if (tree.AJAX.http.readyState < 4 && tree.AJAX.http.status == 200) {
                    //if (tree.contMenu.box.el) tree.contMenu.box.el.setAttribute('id', 'load');
                }
                if (tree.AJAX.http.readyState == 4 && tree.AJAX.http.status == 200) {
                    tree.AJAX.content.innerHTML = tree.AJAX.http.responseText;
                    tree.contMenu.Item.el.list.removeEventListener('click', tree.contMenu.historyPrep, false);
                    tree.contMenu.historyPrep.call(tree.AJAX.store.children[0].children);
                }
            };
            tree.AJAX.http.send(tree.AJAX.params);
        },
        moveHistory: function () {
            tree.AJAX.params = this.parametrs + this.content;
            tree.AJAX.http = new XMLHttpRequest();
            tree.AJAX.http.open('POST', this.url, true);
            tree.AJAX.http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            tree.AJAX.http.onreadystatechange = function () {
                if (tree.AJAX.http.readyState < 4 && tree.AJAX.http.status == 200) {
                    //if (tree.contMenu.box.el) tree.contMenu.box.el.setAttribute('id', 'load');
                }
                if (tree.AJAX.http.readyState == 4 && tree.AJAX.http.status == 200) {
                    tree.AJAX.content = tree.AJAX.http.responseText;
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