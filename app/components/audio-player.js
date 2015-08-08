import Ember from 'ember';

export default Ember.Component.extend({
  draggingPlayhead: null,
  playheadPosition: null,
  player: Ember.inject.service('player'),
  touchMove(e) {
    const {
      originalEvent: {
        touches: {
          0: { pageX: x, pageY: y } // jshint ignore:line
        }
      }
    } = e;
    e.clientX = x;
    e.clientY = y;
    this.mouseMove(e);
  },
  mouseMove(e) {
    if (this.get('draggingPlayhead')) {
      this.movePlayheadTo(e.clientX);
    }
  },
  touchLeave() {
    this.mouseLeave();
  },
  mouseLeave() {
    this.stopDragging();
  },
  touchEnd() {
    this.mouseUp();
  },
  mouseUp() {
    this.stopDragging();
  },
  movePlayheadTo(x) {
    const width = this.$().width();
    const ratio = x / width;
    const duration = this.get('player.duration');
    const seekTo = duration * ratio * 1000;
    this.get('player').seekTo(this.get('player.episode'), seekTo);
    this.set('playheadPosition', x);
  },
  stopDragging() {
    this.set('draggingPlayhead', false);
    this.set('playheadPosition', null);
  },
  actions: {
    seekTo(e) {
      this.movePlayheadTo(e.clientX);
    },
    dragTrack(e) {
      this.movePlayheadTo(e.clientX);
    },
    play() {
      this.get('player').play();
    },
    pause() {
      this.get('player').pause();
    }
  },
  progressStyle: Ember.computed('player.progress', function() {
    return new Ember.Handlebars.SafeString(`width: ${this.get('player.progress')}%`);
  }),
  bufferStyle: Ember.computed('player.buffer', function() {
    return new Ember.Handlebars.SafeString(`width: ${this.get('player.buffer')}%`);
  })
});
