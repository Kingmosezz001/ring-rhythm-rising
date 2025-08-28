export const generateFacialExpression = (
  success: boolean,
  actionType: string,
  stamina: number
): string => {
  const expressions = {
    success: {
      aggressive: [
        "Your eyes light up with predatory intensity as you taste blood!",
        "A fierce snarl crosses your face as you press the attack!",
        "Your jaw clenches with determination, sensing victory!",
        "A dangerous smile creeps across your bloodied face!"
      ],
      tactical: [
        "Your eyes narrow with focused calculation!",
        "A look of pure concentration crosses your features!",
        "Your face shows the calm confidence of a master tactician!",
        "Your expression remains ice-cold and methodical!"
      ],
      defensive: [
        "Your face shows the satisfaction of a job well done!",
        "A slight smirk appears as you weather the storm!",
        "Your eyes remain alert and ready for the counter!",
        "Your face displays the composure of a seasoned veteran!"
      ]
    },
    failure: {
      low_stamina: [
        "Your face shows the desperation of a fighter running on fumes!",
        "Exhaustion is written all over your sweat-drenched features!",
        "Your eyes show the panic of a fighter in deep trouble!",
        "Your face is a mask of pain and fatigue!"
      ],
      general: [
        "Frustration flashes across your face as the shot misses!",
        "Your expression darkens with the realization of your mistake!",
        "Concern creeps into your eyes as your opponent gains confidence!",
        "Your face shows the strain of a fight slipping away!"
      ]
    }
  };

  if (success) {
    const typeExpressions = expressions.success[actionType as keyof typeof expressions.success] || expressions.success.aggressive;
    return typeExpressions[Math.floor(Math.random() * typeExpressions.length)];
  } else {
    const failureExpressions = stamina < 30 ? expressions.failure.low_stamina : expressions.failure.general;
    return failureExpressions[Math.floor(Math.random() * failureExpressions.length)];
  }
};

export const generateInjury = (
  choice: { type: string; staminaCost: number },
  success: boolean,
  intensity: "low" | "medium" | "high" | "extreme"
): string => {
  const injuryChance = {
    low: 0.05,
    medium: 0.1,
    high: 0.2,
    extreme: 0.35
  };

  const shouldCauseInjury = Math.random() < injuryChance[intensity];
  
  if (!shouldCauseInjury) return "";

  const injuries = {
    player: [
      "You feel a sharp pain in your ribs - something might be cracked!",
      "Your left eye is starting to swell shut from repeated punishment!",
      "Blood streams from a cut above your eyebrow, obscuring your vision!",
      "Your nose feels like it might be broken - breathing becomes difficult!",
      "A deep cut on your cheek opens up, sending blood down your face!",
      "Your jaw throbs with pain from that crushing blow!"
    ],
    opponent: [
      "Your opponent's eye is nearly swollen shut now!",
      "Blood pours from your opponent's nose - it's definitely broken!",
      "A nasty cut opens above your opponent's eye!",
      "Your opponent's lip is split and bleeding heavily!",
      "Your opponent's cheek is already showing serious swelling!",
      "Your opponent winces and holds his ribs - something's wrong there!"
    ]
  };

  if (success && choice.type === "aggressive") {
    const opponentInjuries = injuries.opponent;
    return opponentInjuries[Math.floor(Math.random() * opponentInjuries.length)];
  } else if (!success && choice.staminaCost > 15) {
    const playerInjuries = injuries.player;
    return playerInjuries[Math.floor(Math.random() * playerInjuries.length)];
  }

  return "";
};

export const generateEndFightCommentary = (
  won: boolean,
  playerName: string,
  opponentName: string,
  rounds: number,
  playerInjuries: string[],
  opponentInjuries: string[],
  fightType: "decision" | "knockout" | "technical"
): string => {
  const commentaries = {
    victory: {
      knockout: [
        `INCREDIBLE! ${playerName} has done it with a devastating knockout! What a spectacular finish! The crowd is absolutely electric! ${opponentName} is down and this one is OVER! That's the kind of knockout that makes careers!`,
        `LIGHTS OUT! ${playerName} just delivered a crushing blow that sent ${opponentName} crashing to the canvas! What a devastating finish! The power behind that shot was absolutely incredible!`,
        `WHAT A KNOCKOUT! ${playerName} just starched ${opponentName} with a picture-perfect shot! The arena has erupted! That's the kind of knockout that gets replayed for years to come!`
      ],
      technical: [
        `The referee has stopped this fight! ${playerName} was just too much for ${opponentName} tonight! What a dominant technical performance! The punishment was becoming too severe to continue!`,
        `TKO! The corner has seen enough and thrown in the towel! ${playerName} was breaking down ${opponentName} systematically! A masterful performance!`,
        `Technical knockout! ${playerName} has forced the stoppage with relentless pressure and precision! ${opponentName} showed tremendous heart but the damage was mounting!`
      ],
      decision: [
        `What a war! After ${rounds} grueling rounds, ${playerName} takes the victory on the scorecards! Both fighters gave everything they had! ${playerName} just edged it with superior ring generalship!`,
        `A hard-fought decision victory for ${playerName}! This was boxing at its finest - skill, heart, and determination on display for ${rounds} rounds! What a performance!`,
        `The judges have spoken and ${playerName} is your winner! What a back-and-forth battle! Both fighters deserve credit for an absolute war!`
      ]
    },
    defeat: {
      knockout: [
        `Oh no! ${playerName} has been knocked out! ${opponentName} landed the perfect shot and ${playerName} couldn't recover! That's the cruel reality of boxing - one shot can change everything!`,
        `${playerName} is down and hurt! The referee is counting and... that's it! ${opponentName} has scored a dramatic knockout victory! Sometimes the best fighters fall to a perfectly timed shot!`,
        `DEVASTATING knockout by ${opponentName}! ${playerName} walked into that shot and paid the ultimate price! What a crushing blow to end this fight!`
      ],
      technical: [
        `The fight has been stopped! ${playerName} took too much punishment and the referee had to step in! ${opponentName} was just relentless with his attack! Sometimes discretion is the better part of valor!`,
        `TKO defeat for ${playerName}! The corner made the right call to protect their fighter! ${opponentName} was landing too many clean shots! Live to fight another day!`,
        `Technical knockout! ${playerName} showed incredible heart but the damage was mounting! The referee made the right call to protect the fighter!`
      ],
      decision: [
        `Tough luck for ${playerName} tonight! After ${rounds} hard-fought rounds, the judges saw it for ${opponentName}! It was a close fight but ${opponentName} just did enough to edge it!`,
        `A learning experience for ${playerName}! ${opponentName} took the decision victory but ${playerName} showed real class and skill! This is just the beginning of the journey!`,
        `The scorecards favor ${opponentName} tonight! ${playerName} fought valiantly but came up just short! That's boxing - sometimes the margins are razor-thin!`
      ]
    }
  };

  const result = won ? "victory" : "defeat";
  const commentary = commentaries[result][fightType];
  let finalCommentary = commentary[Math.floor(Math.random() * commentary.length)];

  // Add injury context
  if (playerInjuries.length > 0 || opponentInjuries.length > 0) {
    const injuryAddons = [
      " Both fighters showed incredible heart fighting through their injuries!",
      " The physical toll of this fight was evident on both men!",
      " What warrior spirit from both fighters despite the punishment they took!",
      " The doctors will need to check both fighters after this brutal encounter!"
    ];
    finalCommentary += injuryAddons[Math.floor(Math.random() * injuryAddons.length)];
  }

  return finalCommentary;
};