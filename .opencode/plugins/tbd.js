/**
 * tbd plugin for OpenCode.ai
 *
 * Registers the tbd skills directory via the config hook so OpenCode's
 * native skill tool discovers the four tbd skills.
 *
 * Deliberately NO session-start bootstrap and NO message transform:
 * tbd is opt-in by design. Activation is the user asking for trunk-based
 * development (the skill descriptions carry the triggers) or loading the
 * using-tbd skill explicitly.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TbdPlugin = async () => {
  const tbdSkillsDir = path.resolve(__dirname, '../../skills');

  return {
    // Inject the skills path into live config so OpenCode discovers the tbd
    // skills without symlinks or manual config edits. Config.get() returns a
    // cached singleton, so this mutation is visible when skills are lazily
    // discovered later.
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(tbdSkillsDir)) {
        config.skills.paths.push(tbdSkillsDir);
      }
    },
  };
};
