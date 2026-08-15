package governance.policy

import data.governance.policy.judgment

default allow := false

allow if {
	input.resolvedAction.determinate == true

	input.resolvedAction.target != "indeterminate"

	input.resolvedAction.parameters != "indeterminate"

	input.resolvedAction.target.resourceType == "configuration"
	input.resolvedAction.target.operation == "read"

	count(input.currentAuthority.grants) > 0

	some grant in input.currentAuthority.grants
	grant.scope.resourceType == input.resolvedAction.target.resourceType
	grant.scope.operation == input.resolvedAction.target.operation
}

deny if {
	input.resolvedAction.determinate == false
}

deny if {
	input.currentAuthority.empty == true
}

deny if {
	input.resolvedAction.parameters == "indeterminate"
}

metadata := {
	"evaluated_at": time.now_ns(),
	"policy_version": "1.0.0-mvp",
	"scope": "minimal-core-mvp",
}
