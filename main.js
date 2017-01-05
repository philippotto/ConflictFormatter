$(document).ready(function() {
  function diff3ToVersions(diff3) {
    // 0: common
    // 1: version A
    // 2: base version
    // 3: version B
    var state = 0;
    var versions = {
      a : [],
      b : [],
      base : []
    };

    diff3.split("\n").forEach(function(line) {
      if (line.indexOf("<<<<<<< HEAD") === 0) {
        state = 1;
      } else if (line.indexOf("||||||| merged common ancestors") === 0) {
        state = 2;
      } else if (line.indexOf("=======") === 0) {
        state = 3;
      } else if (line.indexOf(">>>>>>>") === 0) {
        state = 0;
      } else {
        if (state === 0) {
          versions.a.push(line);
          versions.b.push(line);
          versions.base.push(line);
        } else if (state === 1) {
          versions.a.push(line);
        } else if (state === 2) {
          versions.base.push(line);
        } else if (state === 3) {
          versions.b.push(line);
        }
      }
    });
    versions.a = versions.a.join("\n");
    versions.b = versions.b.join("\n");
    versions.base = versions.base.join("\n");
    return versions;
  }

  function generateAndDrawDiffs(versions) {
    var diffA = JsDiff.createTwoFilesPatch(
      "Base Version",
      "Conflict A",
      versions.base,
      versions.a,
      "",
      ""
    );

    var diffB = JsDiff.createTwoFilesPatch(
      "Base Version",
      "Conflict B",
      versions.base,
      versions.b,
      "",
      ""
    );

    var drawerA = new Diff2HtmlUI({diff: diffA});
    drawerA.draw(
      '#diff-viewer-A',
      {inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'side-by-side'}
    );

    var drawerB = new Diff2HtmlUI({diff: diffB});
    drawerB.draw(
      '#diff-viewer-B',
      {inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'side-by-side'}
    );
  }

  $("#diff-button").click(function() {
    var diff3 = document.getElementById("conflict-input").value;
    var versions = diff3ToVersions(diff3);
    generateAndDrawDiffs(versions);
  });
});
