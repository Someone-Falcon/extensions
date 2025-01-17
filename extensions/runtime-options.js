(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Runtime Options extension needs to be run unsandboxed');
  }

  const TURBO_MODE = 'turbo mode';
  const INTERPOLATION = 'interpolation';
  const REMOVE_FENCING = 'remove fencing';
  const REMOVE_MISC_LIMITS = 'remove misc limits';
  const HIGH_QUALITY_PEN = 'high quality pen';

  class RuntimeOptions {
    getInfo () {
      return {
        id: 'runtimeoptions',
        name: 'Runtime Options',
        color1: '#3467eb',
        color2: '#4e7bed',
        color3: '#2d53b3',

        blocks: [
          {
            opcode: 'getEnabled',
            text: 'is [thing] enabled?',
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              thing: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: TURBO_MODE,
                menu: 'thing'
              }
            }
          },
          {
            opcode: 'setEnabled',
            text: 'set [thing] to [enabled]',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              thing: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: TURBO_MODE,
                menu: 'thing'
              },
              enabled: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'true',
                menu: 'enabled'
              }
            }
          },

          '---',

          {
            opcode: 'getFramerate',
            text: 'get framerate',
            blockType: Scratch.BlockType.REPORTER
          },
          {
            opcode: 'setFramerate',
            text: 'set framerate to [fps]',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              fps: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '30'
              }
            }
          },

          '---',

          {
            opcode: 'getCloneLimit',
            text: 'get clone limit',
            blockType: Scratch.BlockType.REPORTER
          },
          {
            opcode: 'setCloneLimit',
            text: 'set clone limit [limit]',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              limit: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '300',
                menu: 'clones'
              }
            }
          },

          '---',

          {
            opcode: 'getDimension',
            text: 'get stage [dimension]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              dimension: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'width',
                menu: 'dimension'
              }
            }
          },
          {
            opcode: 'setDimensions',
            text: 'set stage size width: [width] height: [height]',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              width: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '480'
              },
              height: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '360'
              }
            }
          }
        ],
        menus: {
          thing: {
            acceptReporters: true,
            items: [
              {
                text: 'turbo mode',
                value: TURBO_MODE
              },
              {
                text: 'interpolation',
                value: INTERPOLATION
              },
              {
                text: 'remove fencing',
                value: REMOVE_FENCING
              },
              {
                text: 'remove misc limits',
                value: REMOVE_MISC_LIMITS
              },
              {
                text: 'high quality pen',
                value: HIGH_QUALITY_PEN
              }
            ]
          },

          enabled: {
            acceptReporters: true,
            items: [
              {
                text: 'enabled',
                value: 'true'
              },
              {
                text: 'disabled',
                value: 'false'
              }
            ]
          },

          clones: {
            acceptReporters: true,
            items: [
              {
                text: 'default (300)',
                value: '300'
              },
              {
                text: 'Infinity',
                value: 'Infinity'
              }
            ]
          },

          dimension: {
            acceptReporters: true,
            items: [
              {
                text: 'width',
                value: 'width'
              },
              {
                text: 'height',
                value: 'height'
              }
            ]
          }
        }
      };
    }

    getEnabled ({ thing }) {
      if (thing === TURBO_MODE) {
        return Scratch.vm.runtime.turboMode;
      } else if (thing === INTERPOLATION) {
        return Scratch.vm.runtime.interpolationEnabled;
      } else if (thing === REMOVE_FENCING) {
        return !Scratch.vm.runtime.runtimeOptions.fencing;
      } else if (thing === REMOVE_MISC_LIMITS) {
        return !Scratch.vm.runtime.runtimeOptions.miscLimits;
      } else if (thing === HIGH_QUALITY_PEN) {
        return Scratch.renderer.useHighQualityRender;
      }
      return false;
    }

    setEnabled ({ thing, enabled }) {
      enabled = Scratch.Cast.toBoolean(enabled);

      if (thing === TURBO_MODE) {
        Scratch.vm.setTurboMode(enabled);
      } else if (thing === INTERPOLATION) {
        Scratch.vm.setInterpolation(enabled);
      } else if (thing === REMOVE_FENCING) {
        Scratch.vm.setRuntimeOptions({
          fencing: !enabled
        });
      } else if (thing === REMOVE_MISC_LIMITS) {
        Scratch.vm.setRuntimeOptions({
          miscLimits: !enabled
        });
      } else if (thing === HIGH_QUALITY_PEN) {
        Scratch.renderer.setUseHighQualityRender(enabled);
      }
    }

    getFramerate () {
      return Scratch.vm.runtime.frameLoop.framerate;
    }

    setFramerate ({ fps }) {
      fps = +fps || 0;
      Scratch.vm.setFramerate(fps);
    }

    getCloneLimit () {
      return Scratch.vm.runtime.runtimeOptions.maxClones;
    }

    setCloneLimit ({ limit }) {
      limit = +limit || 0;
      Scratch.vm.setRuntimeOptions({
        maxClones: limit
      });
    }

    getDimension ({ dimension }) {
      if (dimension === 'width') {
        return Scratch.vm.runtime.stageWidth;
      } else if (dimension === 'height') {
        return Scratch.vm.runtime.stageHeight;
      }
      return 0;
    }

    setDimensions ({ width, height }) {
      width = +width || 0;
      height = +height || 0;
      Scratch.vm.setStageSize(width, height);
    }
  }

  Scratch.extensions.register(new RuntimeOptions());
})(window.Scratch);
