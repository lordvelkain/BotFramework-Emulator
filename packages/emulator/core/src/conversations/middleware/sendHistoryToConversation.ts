//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Framework Emulator Github:
// https://github.com/Microsoft/BotFramwork-Emulator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import * as HttpStatus from 'http-status-codes';
import * as Restify from 'restify';

import BotEmulator from '../../botEmulator';
import GenericActivity from '../../types/activity/generic';
import ResourceResponse from '../../types/response/resource';
import sendErrorResponse from '../../utils/sendErrorResponse';
import ConversationHistory from '../../types/activity/conversationHistory';
import createResourceResponse from '../../utils/createResponse/resource';

export default function sendHistoryToConversation(botEmulator: BotEmulator) {
  return (req: Restify.Request, res: Restify.Response, next: Restify.Next): any => {
    const history = <ConversationHistory> req.body;
    var successCount = 0;
    var firstErrorMessage = '';

    for(let activity of history.Activities) {
      try {
        (req as any).conversation.postActivityToUser(activity, true);
        successCount++;
      } catch(err) {
        if (firstErrorMessage === '') firstErrorMessage = err;
      }
    }

    var response = createResourceResponse(`Processed ${successCount} of ${history.Activities.length} activities successfully.${firstErrorMessage}`);
    res.send(HttpStatus.OK, response);
    res.end();
    next();
  };
}
