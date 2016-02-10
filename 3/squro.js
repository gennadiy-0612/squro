/**
 * Created by Gennadiy Shcherbakha on 04.12.2015.
 */
'use strict';
var tree;
tree = {
    items: {
        span: {
            dragaElemets: document.getElementsByTagName('span'),
            resetter: function () {
                //Set functional to span of ul tree
                for (var i = 0; i < this.dragaElemets.length; i++) {
                    this.dragaElemets[i].parentNode.setAttribute('draggable', 'false');
                    this.dragaElemets[i].addEventListener('dblclick', tree.dblclick.getTarget, false);
                    this.dragaElemets[i].parentNode.addEventListener('mouseenter', tree.items.mouse.enter.doIt, false);
                    this.dragaElemets[i].parentNode.addEventListener('mouseleave', tree.items.mouse.leave.doIt, false);
                    if (this.dragaElemets[i].parentNode.parentNode.parentNode.tagName === 'BODY') {
                        //Prevent of propagate even to child
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
                    if (this.button[i].textContent === ' ') this.button[i].textContent = '+';//Set sign of clotting
                }
            }
        },
        doIt: function (event) {//Change sign of clotting
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
            //Set element for drug & drop operation
            enter: {
                //When event enter mouse fire
                drag: 'true',
                doIt: function (event) {
                    event.target.setAttribute('draggable', 'true');
                }
            },
            leave: {
                //When event leave mouse fire
                drag: 'false',
                doIt: function (event) {
                    event.target.setAttribute('draggable', 'false');
                }
            }
        },
        drag: {
            start: function (event) {
                // Store a reference on the dragged elemnt
                tree.items.drag.thisInsertOld = event.target;
                tree.items.drag.thisInsert = new Object(event.target.cloneNode(true));
                event.dataTransfer.setData('text', 'data');
                event.dataTransfer.effectAllowed = "move";
            },
            over: function (event) {
                // Prevent default to allow drop
                event.preventDefault();
            },
            clot: '',
            drop: function (event) {
                //Insert deep new copy old element and then delete old element
                tree.items.drag.thisInsertBefore = event.target.parentNode;
                tree.items.drag.clot = tree.items.drag.thisInsertBefore.parentNode.insertBefore(tree.items.drag.thisInsert, tree.items.drag.thisInsertBefore);
                tree.items.drag.thisInsertOld.parentNode.removeChild(tree.items.drag.thisInsertOld);
                tree.items.drag.clot.children[0].addEventListener('click', tree.items.doIt, false);
                tree.items.span.dragaElemets = tree.items.drag.clot.getElementsByTagName('span');
                //Reset all functional again
                tree.items.span.resetter();
            }
        }
    },
    load: function () {
        //Make a deep copy for further access
        tree.refrashNodeEvens = new Object(tree.items.span);
        //When load event occur apply full functional to element
        tree.items.span.resetter.call(tree.items.span);
        tree.refrashClotEvens = new Object(tree.items.clot);
        tree.items.clot.doIt.call(tree.items.clot);
        //Make element blocker for silent ajax
        tree.disactive = document.getElementsByTagName('h1')[0];
    },
    loadCopy: function () {
        //Take elements who are locate only in a tree
        tree.refrashNodeEvens.dragaElemets = document.getElementsByClassName('node')[0].getElementsByTagName('span');
        tree.refrashClotEvens.button = document.getElementsByClassName('node')[0].getElementsByTagName('div');
        //Reset all functional again
        tree.refrashNodeEvens.resetter();
        tree.refrashClotEvens.doIt();
    },
    //Insert a main box of menu for editing of tree elements
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
        //Fill items for further editing in a main box
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
                //Make reference for further access
                this.el[this.ID] = this.childs;
            }
        },
        insert: function (event) {
            event.preventDefault();
            if (document.getElementById('contextmenu') === null) {
                tree.items.span = event.target;
                //Mark worker element
                tree.items.span.setAttribute('class', 'active');
                //Make a main box containing elements of control
                tree.contMenu.box.make.call(tree.contMenu.box);

                //Make close menu control button
                tree.contMenu.Item.parents = tree.contMenu.box.el;
                tree.contMenu.Item.ID = 'close';
                tree.contMenu.Item.evListName = tree.contMenu.closeContMenu;
                tree.contMenu.Item.make.call(tree.contMenu.Item);
                tree.contMenu.Item.childs.textContent = 'X';

                //Make view list of history control button
                tree.contMenu.Item.ID = 'list';
                tree.contMenu.Item.evListName = tree.contMenu.readHistory;
                tree.contMenu.Item.make.call(tree.contMenu.Item);

                //Make clone of element control button
                tree.contMenu.Item.ID = 'clone';
                tree.contMenu.Item.evListName = tree.contMenu.clone;
                tree.contMenu.Item.make.call(tree.contMenu.Item);

                //Make delete of element control button
                tree.contMenu.Item.ID = 'delete';
                tree.contMenu.Item.evListName = tree.contMenu.delete;
                tree.contMenu.Item.make.call(tree.contMenu.Item);

                //Make save of element control button
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
        closeListItems: function () {
            document.body.removeChild(tree.contMenu.listHistory.titleBox);
            document.body.removeChild(tree.contMenu.listHistory.fullBox);
            tree.contMenu.box.el.setAttribute('style', '');
        },
        clone: function () {
            tree.items.span.removeAttribute('class');
            tree.items.span.parentNode.parentNode.insertBefore(
                tree.items.span.parentNode.cloneNode(true),
                tree.items.span.parentNode);
            tree.loadCopy();
        },
        delete: function () {
            tree.items.span.parentNode.parentNode.removeChild(tree.items.span.parentNode);
        },
        save: function () {
            document.body.removeChild(tree.contMenu.box.el);
            tree.items.span.removeAttribute('class');
            tree.AJAX.paramName = 'insertul=';
            tree.AJAX.paramValue = document.getElementsByClassName('node')[0].innerHTML;
            tree.AJAX.whatChange = document.getElementsByClassName('node')[0];
            tree.AJAX.update.call(tree.AJAX);
            tree.contMenu.box.el.setAttribute('style', 'visibility:hidden;');
        },
        //List of history
        listHistory: {
            title: 'div',
            titleBox: '',
            full: 'ul',
            fullBox: '',
            store: function () {
                this.titleBox = document.body.appendChild(document.createElement(this.title));
                this.titleBox.setAttribute('class', 'titleBox');
                //Elements of control opacity in event small screan of ua
                this.titleBox.innerHTML = '' +
                    '<span class="plus" title="Add opacity to a list if small screan of ua">-</span>' +
                    '<span class="minus" title="Remove opacity to a list if small screan of ua">+</span>' +
                    '<span class="close" title="Close hisory list">X</span>' +
                    '<span class="refresh" title="Refresh hisory list">Refresh</span>';
                this.fullBox = document.body.appendChild(document.createElement(this.full));
                this.fullBox.setAttribute('class', 'listcontent');
                this.titleBox.children[0].addEventListener('click', tree.contMenu.setOpacity, false);
                this.titleBox.children[1].addEventListener('click', tree.contMenu.setOpacity, false);
                this.titleBox.children[2].addEventListener('click', tree.contMenu.closeListItems, false);
                this.titleBox.children[3].addEventListener('click', tree.contMenu.refreshHistory, false);
            },
            reset: function () {
                for (var i = 0; i < this.fullBox.children.length; ++i) {
                    this.fullBox.children[i].children[1].addEventListener('click', tree.contMenu.updateHistory, false);
                    this.fullBox.children[i].children[3].addEventListener('click', tree.contMenu.insertHistory, false);
                    this.fullBox.children[i].children[2].addEventListener('click', tree.contMenu.deleteHistory, false);
                }

            }
        },
        readHistory: function () {
            tree.AJAX.paramName = 'readhistory=';
            tree.AJAX.whatToDo = tree.contMenu.listHistory.store;
            tree.AJAX.whatChange = tree.contMenu.listHistory.fullBox;
            tree.AJAX.read.call(tree.AJAX);
            tree.contMenu.box.el.setAttribute('style', 'visibility:hidden;');
        },
        updateHistory: function () {
            tree.AJAX.paramName = 'updatehistory=';
            tree.AJAX.paramValue = this.parentNode.children[0].textContent;
            tree.AJAX.whatChange = tree.disactive.nextElementSibling;
            tree.AJAX.update.call(tree.AJAX);
            tree.contMenu.box.el.setAttribute('style', 'visibility:hidden;');
        },
        insertHistory: function () {
            tree.AJAX.paramName = 'insethistory=';
            tree.AJAX.paramValue = this.parentNode.children[0].textContent;
            tree.AJAX.whatChange = tree.disactive.nextElementSibling;
            tree.AJAX.update.call(tree.AJAX);
            tree.contMenu.box.el.setAttribute('style', 'visibility:hidden;');
        },
        deleteHistory: function () {
            tree.AJAX.paramName = 'deletehistory=';
            tree.AJAX.paramValue = this.parentNode.children[0].textContent;
            tree.AJAX.whatChange = tree.disactive.nextElementSibling;
            tree.AJAX.update.call(tree.AJAX);
            tree.contMenu.box.el.setAttribute('style', 'visibility:hidden;');
        },
        refreshHistory: function () {
            tree.AJAX.paramName = 'readhistory=';
            document.body.removeChild(tree.contMenu.listHistory.titleBox);
            document.body.removeChild(tree.contMenu.listHistory.fullBox);
            tree.AJAX.whatToDo = tree.contMenu.listHistory.store;
            tree.AJAX.whatChange = tree.contMenu.listHistory.fullBox;
            tree.AJAX.read.call(tree.AJAX);
            tree.contMenu.box.el.setAttribute('style', 'visibility:hidden;');
        },
        opac: {
            op: 9,
            elemInfo: '',
            elemToChange: '',
            sign: '',
            setting: function () {
                this.sign == '+' ?
                    this.op < 9 ? this.op++ : this.op = 9 :
                    this.op > 1 ? this.op-- : this.op = 1;
                this.elemInfo.setAttribute('style', 'opacity:0.' + this.op + ';');
                this.elemToChange.setAttribute('style', 'opacity:0.' + this.op + ';');
            }
        },
        Opacity: {},
        setOpacity: function () {
            var a = tree.contMenu.opac;
            a.elemInfo = this.parentNode;
            a.elemToChange = this.parentNode.nextSibling;
            a.sign = this.textContent;
            a.setting.call(a);
        }
    },
    AJAX: {
        url: 'CrudClass.php',
        paramName: 'updatehistory=',
        paramValue: '',
        whatChange: '',
        whatToDo: '',
        http: new XMLHttpRequest(),
        read: function () {
            this.params = this.paramName;
            this.http.open('POST', this.url, true);
            this.http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            this.http.onreadystatechange = this.readStage;
            this.http.send(this.params);
        },
        readStage: function () {
            if (tree.AJAX.http.readyState === 2 && tree.AJAX.http.status == 200) {
                tree.AJAX.whatToDo.call(tree.contMenu.listHistory);
                tree.disactive.setAttribute('id', 'load');
            }
            if (tree.AJAX.http.readyState == 4 && tree.AJAX.http.status == 200) {
                tree.AJAX.whatChange = tree.contMenu.listHistory.fullBox;
                tree.AJAX.whatChange.innerHTML = tree.AJAX.http.responseText;
                tree.contMenu.listHistory.reset();
                tree.disactive.setAttribute('id', 'loaded');
            }
        },
        update: function () {
            this.params = this.paramName + this.paramValue;
            this.http.open('POST', this.url, true);
            this.http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            this.http.onreadystatechange = this.updateStage;
            this.http.send(this.params);
        },
        updateStage: function () {
            if (tree.AJAX.http.readyState === 2 && tree.AJAX.http.status == 200) {
                tree.disactive.setAttribute('id', 'load');
            }
            if (tree.AJAX.http.readyState == 4 && tree.AJAX.http.status == 200) {
                tree.disactive.nextElementSibling.innerHTML = tree.AJAX.http.responseText;
                tree.disactive.setAttribute('id', 'loaded');
                tree.loadCopy();
            }
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
            //Change not editable element to editable
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
            //Change editable element to not editable
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